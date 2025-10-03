import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../entities/course.entity';
import { Unit } from '../entities/unit.entity';
import { Lesson } from '../entities/lesson.entity';
import { CreateCourseDto } from '../dto/create-course.dto';
import { UpdateCourseDto } from '../dto/update-course.dto';
import { CreateUnitDto } from '../dto/create-unit.dto';
import { UpdateUnitDto } from '../dto/update-unit.dto';
import { CreateLessonDto } from '../dto/create-lesson.dto';
import { UpdateLessonDto } from '../dto/update-lesson.dto';
import { CourseListItemDto } from '../dto/course-list.dto';
import { CreateModuleDto } from '../dto/create-module.dto';
import { OpenRouterService } from '../../chat/services/openrouter.service';
import { ChatService } from '../../chat/services/chat.service';
import { AskLessonQuestionDto } from '../dto/ask-lesson-question.dto';
import * as promptsData from './prompts.json';
import * as fs from 'fs';
import * as path from 'path';

interface PromptsConfig {
  systemPrompt: string;
  userPromptTemplate: string;
  complexityLevels: {
    simple: string;
    normal: string;
    professional: string;
  };
}

interface LessonGenerationResponse {
  title: string;
  content: string;
  readingTime: number;
  difficulty: number;
}

const prompts = promptsData as PromptsConfig;

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(Unit)
    private readonly unitRepository: Repository<Unit>,
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
    private readonly openRouterService: OpenRouterService,
    private readonly chatService: ChatService,
  ) {}

  // ... Course methods
  createCourse(createCourseDto: CreateCourseDto) {
    const course = this.courseRepository.create({
      ...createCourseDto,
      user: { id: createCourseDto.userId },
    });
    return this.courseRepository.save(course);
  }

  findAllCourses() {
    return this.courseRepository.find();
  }

  async findCoursesForList(): Promise<CourseListItemDto[]> {
    const courses = await this.courseRepository.find({
      select: ['id', 'title'],
    });
    return courses.map((course) => ({
      id: course.id,
      title: course.title,
    }));
  }

  async findOneCourse(id: string) {
    const course = await this.courseRepository.findOneBy({ id });
    if (!course) {
      throw new NotFoundException(`Course with ID "${id}" not found`);
    }
    return course;
  }

  async updateCourse(id: string, updateCourseDto: UpdateCourseDto) {
    await this.findOneCourse(id); // Проверка существования
    await this.courseRepository.update(id, updateCourseDto);
    return this.findOneCourse(id);
  }

  async removeCourse(id: string) {
    await this.findOneCourse(id); // Проверка существования
    return this.courseRepository.delete(id);
  }

  // ... Unit methods
  createUnit(createUnitDto: CreateUnitDto) {
    const unit = this.unitRepository.create({
      ...createUnitDto,
      course: { id: createUnitDto.courseId },
    });
    return this.unitRepository.save(unit);
  }

  findAllUnits() {
    return this.unitRepository.find();
  }

  async findOneUnit(id: string) {
    const unit = await this.unitRepository.findOneBy({ id });
    if (!unit) {
      throw new NotFoundException(`Unit with ID "${id}" not found`);
    }
    return unit;
  }

  async updateUnit(id: string, updateUnitDto: UpdateUnitDto) {
    await this.findOneUnit(id); // Проверка существования
    await this.unitRepository.update(id, updateUnitDto);
    return this.findOneUnit(id);
  }

  async removeUnit(id: string) {
    await this.findOneUnit(id); // Проверка существования
    return this.unitRepository.delete(id);
  }

  // ... Lesson methods
  createLesson(createLessonDto: CreateLessonDto) {
    const lesson = this.lessonRepository.create({
      ...createLessonDto,
      unit: { id: createLessonDto.unitId },
    });
    return this.lessonRepository.save(lesson);
  }

  findAllLessons() {
    return this.lessonRepository.find();
  }

  async findOneLesson(id: string) {
    const lesson = await this.lessonRepository.findOneBy({ id });
    if (!lesson) {
      throw new NotFoundException(`Lesson with ID "${id}" not found`);
    }
    return lesson;
  }

  async updateLesson(id: string, updateLessonDto: UpdateLessonDto) {
    await this.findOneLesson(id); // Проверка существования
    await this.lessonRepository.update(id, updateLessonDto);
    return this.findOneLesson(id);
  }

  async removeLesson(id: string) {
    await this.findOneLesson(id); // Проверка существования
    return this.lessonRepository.delete(id);
  }

  async createModule(createModuleDto: CreateModuleDto) {
    let courseId = createModuleDto.courseId;

    // Если выбран новый курс, создаем его
    if (!courseId && createModuleDto.newCourseName) {
      const newCourse = await this.createCourse({
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
    let unit = await this.unitRepository.findOne({
      where: { course: { id: courseId } },
      order: { order: 'DESC' },
    });

    if (!unit) {
      unit = this.unitRepository.create({
        course: { id: courseId },
        title: 'Раздел 1',
        order: 1,
      });
      unit = await this.unitRepository.save(unit);
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
      title: createModuleDto.topic,
      content: lessonContent,
      order: lessonsCount + 1,
    });

    const savedLesson = await this.lessonRepository.save(lesson);

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
  ): Promise<string> {
    // Get complexity description from prompts.json
    const validComplexity = ['simple', 'normal', 'professional'].includes(
      complexity,
    )
      ? (complexity as keyof PromptsConfig['complexityLevels'])
      : 'normal';
    const complexityDescription = prompts.complexityLevels[validComplexity];

    // Build user prompt from template
    const detailsSection = details ? `Additional details: ${details}\n` : '';

    const userPrompt = prompts.userPromptTemplate
      .replace('${topic}', topic)
      .replace('${details}', detailsSection)
      .replace('${complexityDescription}', complexityDescription);

    const messages = [
      { role: 'system', content: prompts.systemPrompt },
      { role: 'user', content: userPrompt },
    ];

    // Define JSON Schema for structured output
    const lessonSchema = {
      type: 'json_schema',
      json_schema: {
        name: 'lesson_generation',
        strict: true,
        schema: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description: 'Заголовок урока',
            },
            content: {
              type: 'string',
              description:
                'Основной контент урока в формате HTML с подробным объяснением темы',
            },
            readingTime: {
              type: 'number',
              description: 'Примерное время чтения урока в минутах',
            },
            difficulty: {
              type: 'number',
              description: 'Уровень сложности урока от 1 до 5',
            },
          },
          required: ['title', 'content', 'readingTime', 'difficulty'],
          additionalProperties: false,
        },
      },
    } as const;

    try {
      const response = await this.openRouterService.generateResponse(messages, {
        response_format: lessonSchema,
      });

      // Сохраняем response в JSON файл для отладки
      this.saveDebugResponse(response, topic);

      console.log('response:\n', response);
      // Parse the structured JSON response
      const lessonData = JSON.parse(response) as LessonGenerationResponse;

      // Log the parsed lesson data
      console.log('Parsed lesson data:', {
        title: lessonData.title,
        readingTime: lessonData.readingTime,
        difficulty: lessonData.difficulty,
        contentLength: lessonData.content.length,
      });

      return lessonData.content;
    } catch (error) {
      console.error('Error generating lesson content:', error);
      throw new Error('Failed to generate lesson content');
    }
  }

  private saveDebugResponse(response: string, topic: string): void {
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
      const filePath = path.join(debugDir, fileName);

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
      console.log(`Debug response saved to: ${filePath}`);
    } catch (error) {
      // Не бросаем ошибку, чтобы не прерывать основной процесс
      console.error('Failed to save debug response:', error);
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
    const lesson = await this.findOneLesson(lessonId);

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
  ): Promise<{
    message: string;
    threadId: string;
  }> {
    await this.findOneLesson(lessonId);
    return this.chatService.deleteThread(lessonId, threadId);
  }

  async regenerateMessage(
    lessonId: string,
    messageId: string,
  ): Promise<{
    message: string;
    newMessage: any;
  }> {
    const lesson = await this.findOneLesson(lessonId);
    return this.chatService.regenerateMessage(
      lessonId,
      messageId,
      lesson.content,
    );
  }

  async getThreads(lessonId: string): Promise<any[]> {
    await this.findOneLesson(lessonId);
    return this.chatService.getThreads(lessonId);
  }

  async getThreadMessages(lessonId: string, threadId: string): Promise<any[]> {
    await this.findOneLesson(lessonId);
    return this.chatService.getThreadMessages(lessonId, threadId);
  }
}
