import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, In } from 'typeorm';
import { Lesson, LessonStatus } from '../entities/lesson.entity';
import { CreateLessonDto } from '../dto/create-lesson.dto';
import { UpdateLessonDto } from '../dto/update-lesson.dto';
import { CreateModuleDto } from '../dto/create-module.dto';
import { CreateCourseOutlineDto } from '../dto/create-course-outline.dto';
import { AskLessonQuestionDto } from '../dto/ask-lesson-question.dto';
import { OpenRouterService } from '../../chat/services/openrouter.service';
import { ChatService } from '../../chat/services/chat.service';
import { CoursesService } from './courses.service';
import { UnitsService } from './units.service';
import { AccessControlService } from '../../../shared/services/access-control.service';
import { AccessDeniedException } from '../../../shared/exceptions/access-denied.exception';
import {
  lessonGenerationPrompts,
  PromptsConfig,
} from '../config/lesson-generation.prompts';
import {
  lessonGenerationSchema,
  LessonGenerationResponse,
} from '../config/lesson-generation.schema';
import {
  courseGenerationPrompts,
  CoursePromptsConfig,
} from '../config/course-generation.prompts';
import {
  courseGenerationSchema,
  CourseGenerationResponse,
} from '../config/course-generation.schema';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LessonsService {
  private readonly logger = new Logger(LessonsService.name);

  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
    private readonly openRouterService: OpenRouterService,
    private readonly chatService: ChatService,
    private readonly coursesService: CoursesService,
    private readonly unitsService: UnitsService,
    private readonly accessControlService: AccessControlService,
  ) {}

  createLesson(createLessonDto: CreateLessonDto, userId: string) {
    const lesson = this.lessonRepository.create({
      ...createLessonDto,
      unit: { id: createLessonDto.unitId },
      user: { id: userId },
    });
    return this.lessonRepository.save(lesson);
  }

  findAllLessons() {
    return this.lessonRepository.find({
      relations: ['unit', 'unit.course'],
    });
  }

  async findLessonsByCourseId(courseId: string, userId: string) {
    // Проверяем доступ к курсу
    const hasAccess = await this.accessControlService.checkCourseAccess(
      courseId,
      userId,
    );
    if (!hasAccess) {
      throw new AccessDeniedException('курсу', courseId);
    }

    return this.lessonRepository.find({
      where: {
        unit: {
          course: { id: courseId },
        },
      },
      relations: ['unit', 'unit.course'],
      order: {
        created_at: 'DESC',
      },
    });
  }

  async findOneLesson(id: string, userId: string) {
    const lesson = await this.lessonRepository.findOneBy({ id });
    if (!lesson) {
      throw new NotFoundException(`Lesson with ID "${id}" not found`);
    }

    const hasAccess = await this.accessControlService.checkLessonAccess(
      id,
      userId,
    );
    if (!hasAccess) {
      throw new AccessDeniedException('уроку', id);
    }

    // Если контент урока еще не создан, генерируем его
    if (!lesson.isCreated) {
      const lessonContent = await this.generateLessonContent(
        lesson.title,
        lesson.description,
        'normal', // Можно добавить поле complexity в Lesson entity позже
      );

      // Обновляем урок с сгенерированным контентом
      await this.lessonRepository.update(id, {
        content: lessonContent.content,
        reading_time: lessonContent.readingTime,
        difficulty: lessonContent.difficulty,
        isCreated: true,
      });

      // Возвращаем обновленный урок
      const updatedLesson = await this.lessonRepository.findOneBy({ id });
      if (!updatedLesson) {
        throw new NotFoundException(
          `Lesson with ID "${id}" not found after update`,
        );
      }
      return updatedLesson;
    }

    return lesson;
  }

  async updateLesson(
    id: string,
    updateLessonDto: UpdateLessonDto,
    userId: string,
  ) {
    await this.findOneLesson(id, userId);
    await this.lessonRepository.update(id, updateLessonDto);
    return this.findOneLesson(id, userId);
  }

  async removeLesson(id: string, userId: string) {
    await this.findOneLesson(id, userId);
    return this.lessonRepository.delete(id);
  }

  async findAccessibleLessons(userId: string): Promise<Lesson[]> {
    return this.accessControlService.getAccessibleLessons(userId);
  }

  async findSharedLessons(): Promise<Lesson[]> {
    return this.accessControlService.getSharedLessons();
  }

  async createModule(createModuleDto: CreateModuleDto) {
    let courseId = createModuleDto.courseId;

    // Если выбран новый курс, создаем его
    if (!courseId && createModuleDto.newCourseName) {
      const newCourse = await this.coursesService.createCourse({
        title: createModuleDto.newCourseName,
        description: `Курс создан автоматически для урока: ${createModuleDto.topic}`,
        userId: createModuleDto.userId,
      });
      courseId = newCourse.id;
    }

    if (!courseId) {
      throw new Error('Course ID is required');
    }

    // Находим или создаем Unit для курса
    let unit = await this.unitsService.findUnitByCourseId(courseId);

    if (!unit) {
      unit = await this.unitsService.createUnitForCourse(
        courseId,
        1,
        createModuleDto.userId,
      );
    }

    // Генерируем контент урока через AI
    const lessonContent = await this.generateLessonContent(
      createModuleDto.topic,
      createModuleDto.details,
      createModuleDto.complexity,
    );

    // Получаем порядковый номер для нового урока
    const lessonsCount = await this.lessonRepository.count({
      where: { unit: { id: unit.id } },
    });

    // Создаем урок
    const lesson = this.lessonRepository.create({
      unit: { id: unit.id },
      user: { id: createModuleDto.userId },
      title: lessonContent.title,
      description: lessonContent.description,
      content: lessonContent.content,
      reading_time: lessonContent.readingTime,
      difficulty: lessonContent.difficulty,
      order: lessonsCount + 1,
    });

    const savedLesson = await this.lessonRepository.save(lesson);

    if (!savedLesson) {
      throw new Error('Failed to save lesson');
    }

    return {
      courseId,
      lessonId: savedLesson.id,
      unitId: unit.id,
      title: savedLesson.title,
      content: savedLesson.content,
    };
  }

  private async generateLessonContent(
    topic: string,
    details: string | undefined,
    complexity: string,
  ): Promise<LessonGenerationResponse> {
    // Get complexity description from prompts config
    const validComplexity = ['simple', 'normal', 'professional'].includes(
      complexity,
    )
      ? (complexity as keyof PromptsConfig['complexityLevels'])
      : 'normal';
    const complexityDescription =
      lessonGenerationPrompts.complexityLevels[validComplexity];

    // Build user prompt from template
    const detailsSection = details ? `Additional details: ${details}\n` : '';

    const userPrompt = lessonGenerationPrompts.userPromptTemplate
      .replace('${topic}', topic)
      .replace('${details}', detailsSection)
      .replace('${complexityDescription}', complexityDescription);

    const messages = [
      { role: 'system', content: lessonGenerationPrompts.systemPrompt },
      { role: 'user', content: userPrompt },
    ];

    try {
      const response = await this.openRouterService.generateResponse(messages, {
        response_format: lessonGenerationSchema,
      });

      // Сохраняем response в JSON файл для отладки
      this.saveDebugResponse(response, topic);

      // Parse the structured JSON response
      const lessonData = JSON.parse(response) as LessonGenerationResponse;

      return lessonData;
    } catch (error) {
      const errorObj =
        error instanceof Error ? error : new Error(String(error));
      this.logger.error(
        { err: errorObj, topic, details },
        'Error generating lesson content',
      );
      throw new Error('Failed to generate lesson content');
    }
  }

  private saveDebugResponse(response: string, topic: string): void {
    let filePath = '';
    try {
      // Создаем папку debug, если её нет
      const debugDir = path.join(process.cwd(), 'debug-responses');
      if (!fs.existsSync(debugDir)) {
        fs.mkdirSync(debugDir, { recursive: true });
      }

      // Создаем имя файла с timestamp и безопасным названием темы
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const safeTopic = topic
        .replace(/[^a-zA-Z0-9а-яА-Я]/g, '_')
        .substring(0, 50);
      const fileName = `${timestamp}_${safeTopic}.json`;
      filePath = path.join(debugDir, fileName);

      // Пытаемся распарсить JSON для красивого форматирования
      let formattedContent: string;
      try {
        const parsed: unknown = JSON.parse(response);
        formattedContent = JSON.stringify(parsed, null, 2);
      } catch {
        // Если не JSON, сохраняем как есть
        formattedContent = response;
      }

      // Сохраняем файл
      fs.writeFileSync(filePath, formattedContent, 'utf-8');
    } catch (error) {
      // Не бросаем ошибку, чтобы не прерывать основной процесс, но логируем
      const errorObj =
        error instanceof Error ? error : new Error(String(error));
      this.logger.warn(
        { err: errorObj, topic, filePath },
        'Failed to save debug response',
      );
    }
  }

  async askLessonQuestion(askLessonQuestionDto: AskLessonQuestionDto): Promise<{
    question: string;
    answer: string;
    lessonTitle: string;
    messageId: string;
    threadId: string;
  }> {
    const { lessonId, userId, question, threadId, lessonContent } =
      askLessonQuestionDto;

    // Проверяем, что урок существует
    const lesson = await this.findOneLesson(lessonId, userId);

    // Используем ChatService для обработки вопроса
    const result = await this.chatService.sendMessage({
      lessonId,
      userId,
      content: question,
      threadId,
      lessonContent: lessonContent || lesson.content,
    });

    return {
      question,
      answer: result.aiMessage.content,
      lessonTitle: lesson.title,
      messageId: result.aiMessage.id,
      threadId: result.threadId,
    };
  }

  async deleteThread(
    lessonId: string,
    threadId: string,
    userId: string,
  ): Promise<{
    message: string;
    threadId: string;
  }> {
    await this.findOneLesson(lessonId, userId);
    return this.chatService.deleteThread(lessonId, threadId);
  }

  async regenerateMessage(
    lessonId: string,
    messageId: string,
    userId: string,
  ): Promise<{
    message: string;
    newMessage: unknown;
  }> {
    const lesson = await this.findOneLesson(lessonId, userId);
    return this.chatService.regenerateMessage(
      lessonId,
      messageId,
      lesson.content,
    );
  }

  async getThreads(lessonId: string, userId: string): Promise<unknown[]> {
    await this.findOneLesson(lessonId, userId);
    return this.chatService.getThreads(lessonId);
  }

  async getThreadMessages(
    lessonId: string,
    threadId: string,
    userId: string,
  ): Promise<unknown[]> {
    await this.findOneLesson(lessonId, userId);
    return this.chatService.getThreadMessages(lessonId, threadId);
  }

  async createCourseOutline(createCourseOutlineDto: CreateCourseOutlineDto) {
    // Генерируем структуру курса через AI
    const courseOutline = await this.generateCourseOutline(
      createCourseOutlineDto.topic,
      createCourseOutlineDto.details,
      createCourseOutlineDto.complexity,
    );

    // Создаем курс
    const course = await this.coursesService.createCourse({
      title: courseOutline.name,
      description: courseOutline.description,
      userId: createCourseOutlineDto.userId,
    });

    // Создаем Unit для курса
    const unit = await this.unitsService.createUnitForCourse(
      course.id,
      1,
      createCourseOutlineDto.userId,
    );

    // Создаем уроки-заглушки (без контента)
    const lessons: Lesson[] = [];
    for (let i = 0; i < courseOutline.lessons.length; i++) {
      const lessonData = courseOutline.lessons[i];
      const lesson = this.lessonRepository.create({
        unit: { id: unit.id },
        user: { id: createCourseOutlineDto.userId },
        title: lessonData.name,
        description: lessonData.description,
        content: '', // Пустой контент - будет сгенерирован при открытии урока
        order: i + 1,
        isCreated: false, // Флаг указывает, что контент еще не создан
      });
      const savedLesson = await this.lessonRepository.save(lesson);
      lessons.push(savedLesson);
    }

    return {
      courseId: course.id,
      unitId: unit.id,
      courseTitle: course.title,
      courseDescription: course.description,
      lessons: lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        isCreated: lesson.isCreated,
      })),
    };
  }

  private async generateCourseOutline(
    topic: string,
    details: string | undefined,
    complexity: string,
  ): Promise<CourseGenerationResponse> {
    // Get complexity description from prompts config
    const validComplexity = ['simple', 'normal', 'professional'].includes(
      complexity,
    )
      ? (complexity as keyof CoursePromptsConfig['complexityLevels'])
      : 'normal';
    const complexityDescription =
      courseGenerationPrompts.complexityLevels[validComplexity];

    // Build user prompt from template
    const detailsSection = details ? `Additional details: ${details}\n` : '';

    const userPrompt = courseGenerationPrompts.userPromptTemplate
      .replace('${topic}', topic)
      .replace('${details}', detailsSection)
      .replace('${complexityDescription}', complexityDescription);

    const messages = [
      { role: 'system', content: courseGenerationPrompts.systemPrompt },
      { role: 'user', content: userPrompt },
    ];

    try {
      const response = await this.openRouterService.generateResponse(messages, {
        response_format: courseGenerationSchema,
      });

      // Сохраняем response в JSON файл для отладки
      this.saveDebugResponse(response, `Course_${topic}`);

      // Parse the structured JSON response
      const courseData = JSON.parse(response) as CourseGenerationResponse;

      return courseData;
    } catch (error) {
      const errorObj =
        error instanceof Error ? error : new Error(String(error));
      this.logger.error(
        { err: errorObj, topic },
        'Error generating course outline',
      );
      throw new Error('Failed to generate course outline');
    }
  }

  async findLessonsForReview(userId: string): Promise<Lesson[]> {
    const now = new Date();

    return this.lessonRepository.find({
      where: {
        user: { id: userId },
        next_review_at: LessThanOrEqual(now),
        status: In([LessonStatus.LEARNING, LessonStatus.MASTERED]),
      },
      relations: ['unit', 'unit.course'],
      order: {
        next_review_at: 'ASC',
      },
    });
  }
}
