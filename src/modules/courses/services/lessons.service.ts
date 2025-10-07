import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from '../entities/lesson.entity';
import { CreateLessonDto } from '../dto/create-lesson.dto';
import { UpdateLessonDto } from '../dto/update-lesson.dto';
import { CreateModuleDto } from '../dto/create-module.dto';
import { AskLessonQuestionDto } from '../dto/ask-lesson-question.dto';
import { OpenRouterService } from '../../chat/services/openrouter.service';
import { ChatService } from '../../chat/services/chat.service';
import { CoursesService } from './courses.service';
import { UnitsService } from './units.service';
import {
  lessonGenerationPrompts,
  PromptsConfig,
} from '../config/lesson-generation.prompts';
import {
  lessonGenerationSchema,
  LessonGenerationResponse,
} from '../config/lesson-generation.schema';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
    private readonly openRouterService: OpenRouterService,
    private readonly chatService: ChatService,
    private readonly coursesService: CoursesService,
    private readonly unitsService: UnitsService,
  ) {}

  createLesson(createLessonDto: CreateLessonDto) {
    const lesson = this.lessonRepository.create({
      ...createLessonDto,
      unit: { id: createLessonDto.unitId },
    });
    return this.lessonRepository.save(lesson);
  }

  findAllLessons() {
    return this.lessonRepository.find({
      relations: ['unit', 'unit.course'],
    });
  }

  async findOneLesson(id: string) {
    const lesson = await this.lessonRepository.findOneBy({ id });
    if (!lesson) {
      throw new NotFoundException(`Lesson with ID "${id}" not found`);
    }
    return lesson;
  }

  async updateLesson(id: string, updateLessonDto: UpdateLessonDto) {
    await this.findOneLesson(id);
    await this.lessonRepository.update(id, updateLessonDto);
    return this.findOneLesson(id);
  }

  async removeLesson(id: string) {
    await this.findOneLesson(id);
    return this.lessonRepository.delete(id);
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
      unit = await this.unitsService.createUnitForCourse(courseId, 1);
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
      title: lessonContent.title,
      description: lessonContent.description,
      content: lessonContent.content,
      reading_time: lessonContent.readingTime,
      difficulty: lessonContent.difficulty,
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

      console.log('response:\n', response);
      // Parse the structured JSON response
      const lessonData = JSON.parse(response) as LessonGenerationResponse;

      // Log the parsed lesson data
      console.log('Parsed lesson data:', {
        title: lessonData.title,
        description: lessonData.description,
        readingTime: lessonData.readingTime,
        difficulty: lessonData.difficulty,
        contentLength: lessonData.content.length,
      });

      return lessonData;
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
