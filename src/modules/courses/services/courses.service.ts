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
    const complexityDescriptions: Record<string, string> = {
      simple: 'очень простым, с аналогиями и базовыми терминами',
      normal: 'средним, с правильной терминологией',
      professional:
        'профессиональным, с использованием сложной терминологии и деталей',
    };

    const complexityLevel: string =
      complexityDescriptions[complexity] || complexityDescriptions.normal;

    const systemPrompt = `Ты - эксперт-преподаватель, создающий образовательный контент для платформы PathwiseAI.
Твоя задача - создать структурированный урок в формате JSON.

Требования к уроку:
1. Уровень сложности: ${complexityLevel}
2. Контент должен быть понятным и структурированным
3. Используй markdown для форматирования
4. Включи примеры и пояснения

Верни ТОЛЬКО валидный JSON в следующем формате:
{
  "title": "Название урока",
  "content": "Полный текст урока в markdown формате с разделами, примерами и объяснениями"
}`;

    const userPrompt = `Создай урок на тему: "${topic}"
${details ? `Дополнительные детали: ${details}` : ''}

Урок должен быть ${complexityLevel} и включать:
- Введение и объяснение концепции
- Основной материал с примерами
- Практические советы
- Краткое резюме в конце`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ];

    try {
      const response = await this.openRouterService.generateResponse(messages);

      // Парсим JSON из ответа
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const lessonData = JSON.parse(jsonMatch[0]) as {
          content?: string;
          title?: string;
        };
        return lessonData.content || response;
      }

      // Если не удалось распарсить JSON, возвращаем весь ответ
      return response;
    } catch (error) {
      console.error('Error generating lesson content:', error);
      throw new Error('Не удалось сгенерировать содержимое урока');
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
