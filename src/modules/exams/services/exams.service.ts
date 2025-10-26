import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exam, ExamStatus } from '../entities/exam.entity';
import { ExamResult } from '../entities/exam-result.entity';
import { CreateExamDto } from '../dto/create-exam.dto';
import { UpdateExamDto } from '../dto/update-exam.dto';
import { CreateExamResultDto } from '../dto/create-exam-result.dto';
import { UpdateExamResultDto } from '../dto/update-exam-result.dto';
import { GenerateTestDto } from '../dto/generate-test.dto';
import { SubmitTestResultDto } from '../dto/submit-test-result.dto';
import { CheckTextAnswerDto } from '../dto/check-text-answer.dto';
import { Lesson } from '../../courses/entities/lesson.entity';
import { Question } from '../../questions/entities/question.entity';
import { QuestionType } from '../../questions/entities/question.entity';
import { OpenRouterService } from '../../chat/services/openrouter.service';
import { SM2SpacedRepetitionService } from '../../courses/services/sm2-spaced-repetition.service';
import { testGenerationPrompts } from '../config/test-generation.prompts';
import { testGenerationSchema } from '../config/test-generation.schema';
import { TestGenerationResponse } from '../config/test-generation.schema';
import { textCheckingPrompts } from '../config/text-checking.prompts';
import {
  textCheckingSchema,
  TextCheckingResponse,
} from '../config/text-checking.schema';
import { randomUUID } from 'crypto';

@Injectable()
export class ExamsService {
  private readonly logger = new Logger(ExamsService.name);

  constructor(
    @InjectRepository(Exam)
    private readonly examRepository: Repository<Exam>,
    @InjectRepository(ExamResult)
    private readonly examResultRepository: Repository<ExamResult>,
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    private readonly openRouterService: OpenRouterService,
    private readonly sm2Service: SM2SpacedRepetitionService,
  ) {}

  // Exam methods
  createExam(createExamDto: CreateExamDto) {
    const exam = this.examRepository.create({
      ...createExamDto,
      user: { id: createExamDto.userId },
      course: { id: createExamDto.courseId },
    });
    return this.examRepository.save(exam);
  }

  findAllExams() {
    return this.examRepository.find();
  }

  async findExamsByUser(userId: string) {
    return this.examRepository.find({
      where: { user: { id: userId } },
      relations: ['results', 'results.question', 'course'],
      order: { completed_at: 'DESC' },
    });
  }

  async findExamsByLesson(lessonId: string, userId: string) {
    // Получаем урок для определения курса
    const lesson = await this.lessonRepository.findOne({
      where: { id: lessonId },
      relations: ['unit', 'unit.course'],
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson with ID "${lessonId}" not found`);
    }

    // Ищем экзамены для этого курса с названием, содержащим название урока
    return this.examRepository.find({
      where: {
        user: { id: userId },
        course: { id: lesson.unit.course.id },
        title: `Тест по уроку: ${lesson.title}`,
      },
      relations: ['results', 'results.question', 'course'],
      order: { completed_at: 'DESC' },
    });
  }

  async findOneExam(id: string) {
    const exam = await this.examRepository.findOneBy({ id });
    if (!exam) {
      throw new NotFoundException(`Exam with ID "${id}" not found`);
    }
    return exam;
  }

  async updateExam(id: string, updateExamDto: UpdateExamDto) {
    await this.findOneExam(id); // Проверка существования
    await this.examRepository.update(id, updateExamDto);
    return this.findOneExam(id);
  }

  async removeExam(id: string) {
    await this.findOneExam(id); // Проверка существования
    return this.examRepository.delete(id);
  }

  // ExamResult methods
  createExamResult(createExamResultDto: CreateExamResultDto) {
    const examResult = this.examResultRepository.create({
      ...createExamResultDto,
      exam: { id: createExamResultDto.examId },
      question: { id: createExamResultDto.questionId },
    });
    return this.examResultRepository.save(examResult);
  }

  findAllExamResults() {
    return this.examResultRepository.find();
  }

  async findOneExamResult(id: string) {
    const examResult = await this.examResultRepository.findOneBy({ id });
    if (!examResult) {
      throw new NotFoundException(`ExamResult with ID "${id}" not found`);
    }
    return examResult;
  }

  async updateExamResult(id: string, updateExamResultDto: UpdateExamResultDto) {
    await this.findOneExamResult(id); // Проверка существования
    await this.examResultRepository.update(id, updateExamResultDto);
    return this.findOneExamResult(id);
  }

  async removeExamResult(id: string) {
    await this.findOneExamResult(id); // Проверка существования
    return this.examResultRepository.delete(id);
  }

  // New methods for test generation and management
  async getOrGenerateTestForLesson(generateTestDto: GenerateTestDto) {
    const { lessonId, userId, questionCount } = generateTestDto;

    // Получаем урок для определения курса
    const lesson = await this.lessonRepository.findOne({
      where: { id: lessonId },
      relations: ['unit', 'unit.course'],
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson with ID "${lessonId}" not found`);
    }

    // Проверяем, есть ли уже тест для этого урока
    const existingExam = await this.examRepository.findOne({
      where: {
        user: { id: userId },
        course: { id: lesson.unit.course.id },
        title: `Тест по уроку: ${lesson.title}`,
      },
      relations: ['results', 'results.question'],
    });

    if (existingExam && existingExam.results.length > 0) {
      // Получаем вопросы для существующего экзамена
      const existingQuestions = await this.questionRepository.find({
        where: { lesson: { id: lessonId } },
      });

      // Возвращаем существующий тест
      return this.formatTestForFrontend(existingExam, existingQuestions);
    }

    // Генерируем новый тест
    const generatedTest = await this.generateTestForLesson(
      lesson,
      questionCount || 5,
    );

    // Создаем экзамен
    const exam = this.examRepository.create({
      user: { id: userId },
      course: { id: lesson.unit.course.id },
      title: generatedTest.title,
      status: ExamStatus.IN_PROGRESS,
      started_at: new Date(),
    });

    const savedExam = await this.examRepository.save(exam);

    // Создаем вопросы и сохраняем их
    const questions: Question[] = [];
    for (const generatedQuestion of generatedTest.questions) {
      const question = this.questionRepository.create({
        lesson: { id: lessonId },
        question_text: generatedQuestion.question,
        question_type:
          generatedQuestion.type === 'quiz'
            ? QuestionType.MULTIPLE_CHOICE
            : QuestionType.OPEN_ENDED,
        options: generatedQuestion.options
          ? (generatedQuestion.options as unknown as Record<string, unknown>)
          : undefined,
        correct_answer:
          generatedQuestion.type === 'quiz'
            ? generatedQuestion.options?.find((opt) => opt.isCorrect)?.text ||
              ''
            : generatedQuestion.expectedAnswer || '',
        explanation: generatedQuestion.explanation,
      });

      const savedQuestion = await this.questionRepository.save(question);
      questions.push(savedQuestion);
    }

    // Создаем результаты экзамена (пустые)
    for (const question of questions) {
      const examResult = this.examResultRepository.create({
        exam: { id: savedExam.id },
        question: { id: question.id },
        user_answer: '',
        is_correct: false,
      });
      await this.examResultRepository.save(examResult);
    }

    // Возвращаем форматированный тест
    return this.formatTestForFrontend(savedExam, questions);
  }

  private async generateTestForLesson(
    lesson: Lesson,
    questionCount: number,
  ): Promise<TestGenerationResponse> {
    const userPrompt = testGenerationPrompts.userPromptTemplate
      .replace('${lessonTitle}', lesson.title)
      .replace('${lessonContent}', lesson.content)
      .replace('${questionCount}', questionCount.toString());

    const messages = [
      { role: 'system', content: testGenerationPrompts.systemPrompt },
      { role: 'user', content: userPrompt },
    ];

    try {
      const response = await this.openRouterService.generateResponse(messages, {
        response_format: testGenerationSchema,
      });

      const testData = JSON.parse(response) as TestGenerationResponse;

      // Добавляем уникальные ID к вопросам
      testData.questions = testData.questions.map((q) => ({
        ...q,
        id: randomUUID(),
        options: q.options?.map((opt) => ({
          ...opt,
          id: randomUUID(),
        })),
      }));

      return testData;
    } catch (error) {
      const errorObj =
        error instanceof Error ? error : new Error(String(error));
      this.logger.error(
        { err: errorObj, lessonId: lesson.id, questionCount },
        'Error generating test',
      );
      throw new Error('Failed to generate test');
    }
  }

  private formatTestForFrontend(exam: Exam, questions?: Question[]) {
    return {
      id: exam.id,
      title: exam.title,
      questions:
        questions?.map((q) => ({
          id: q.id,
          type:
            q.question_type === QuestionType.MULTIPLE_CHOICE ? 'quiz' : 'text',
          question: q.question_text,
          options:
            q.question_type === QuestionType.MULTIPLE_CHOICE && q.options
              ? (q.options as Record<string, unknown>[]).map(
                  (opt: Record<string, unknown>, index: number) => ({
                    id: `opt${index + 1}`,
                    text: (opt.text as string) || (opt as unknown as string),
                    isCorrect: (opt.isCorrect as boolean) || false,
                  }),
                )
              : undefined,
          expectedAnswer:
            q.question_type === QuestionType.OPEN_ENDED
              ? q.correct_answer
              : undefined,
          explanation: q.explanation,
        })) || [],
    };
  }

  async submitTestResult(submitTestResultDto: SubmitTestResultDto) {
    const { examId, answers, timeSpent } = submitTestResultDto;

    // Проверяем существование экзамена
    const exam = await this.examRepository.findOne({
      where: { id: examId },
      relations: ['results', 'results.question'],
    });

    if (!exam) {
      throw new NotFoundException(`Exam with ID "${examId}" not found`);
    }

    // Обновляем результаты экзамена
    for (const answer of answers) {
      const examResult = exam.results.find(
        (r) => r.question.id === answer.questionId,
      );
      if (examResult) {
        examResult.user_answer = answer.answer;
        examResult.is_correct = answer.isCorrect;
        await this.examResultRepository.save(examResult);
      }
    }

    // Вычисляем общий балл
    const correctAnswers = answers.filter((a) => a.isCorrect).length;
    const totalQuestions = answers.length;
    const score = (correctAnswers / totalQuestions) * 100;

    // Обновляем экзамен
    exam.score = score;
    exam.status = ExamStatus.COMPLETED;
    exam.completed_at = new Date();
    await this.examRepository.save(exam);

    // НОВОЕ: Обновляем прогресс урока
    await this.updateLessonProgress(exam, score);

    return {
      examId,
      score,
      correctAnswers,
      totalQuestions,
      timeSpent: parseInt(timeSpent),
      completedAt: exam.completed_at,
    };
  }

  private async updateLessonProgress(exam: Exam, score: number) {
    // Получаем урок по названию экзамена (формат: "Тест по уроку: {название урока}")
    const lessonTitle = exam.title.replace('Тест по уроку: ', '');

    const lesson = await this.lessonRepository.findOne({
      where: { title: lessonTitle },
      relations: ['unit', 'unit.course'],
    });

    if (!lesson) {
      this.logger.warn(
        { lessonTitle, examId: exam.id },
        `Lesson with title "${lessonTitle}" not found`,
      );
      return;
    }

    // Рассчитываем новые параметры по SM-2
    const sm2Result = this.sm2Service.calculateNextReview(
      lesson.status,
      lesson.interval,
      lesson.ease_factor,
      score,
    );

    // Обновляем урок
    await this.lessonRepository.update(lesson.id, {
      status: sm2Result.status,
      interval: sm2Result.interval,
      ease_factor: sm2Result.easeFactor,
      last_reviewed_at: new Date(),
      next_review_at: sm2Result.nextReviewAt,
    });
  }

  async checkTextAnswer(
    checkTextAnswerDto: CheckTextAnswerDto,
  ): Promise<TextCheckingResponse> {
    const { userAnswer, expectedAnswer, questionText } = checkTextAnswerDto;

    const userPrompt = textCheckingPrompts.userPromptTemplate
      .replace('${questionText}', questionText)
      .replace('${expectedAnswer}', expectedAnswer)
      .replace('${userAnswer}', userAnswer);

    const messages = [
      { role: 'system', content: textCheckingPrompts.systemPrompt },
      { role: 'user', content: userPrompt },
    ];

    try {
      const response = await this.openRouterService.generateResponse(messages, {
        response_format: textCheckingSchema,
      });

      const checkingResult = JSON.parse(response) as TextCheckingResponse;

      // Валидация результата
      if (typeof checkingResult.isCorrect !== 'boolean') {
        checkingResult.isCorrect = checkingResult.score >= 70;
      }

      if (
        typeof checkingResult.score !== 'number' ||
        checkingResult.score < 0 ||
        checkingResult.score > 100
      ) {
        checkingResult.score = checkingResult.isCorrect ? 85 : 30;
      }

      return checkingResult;
    } catch (error) {
      const errorObj =
        error instanceof Error ? error : new Error(String(error));
      this.logger.error(
        { err: errorObj, questionText, userAnswer },
        'Error checking text answer',
      );

      // Fallback: простая проверка на основе длины и ключевых слов
      const isCorrect = this.simpleTextCheck(userAnswer, expectedAnswer);

      return {
        isCorrect,
        score: isCorrect ? 85 : 30,
        explanation: isCorrect
          ? 'Ответ соответствует ожидаемому содержанию.'
          : 'Ответ не полностью соответствует ожидаемому содержанию.',
        feedback: isCorrect
          ? 'Хороший ответ! Вы правильно поняли вопрос.'
          : 'Попробуйте более подробно раскрыть тему вопроса.',
      };
    }
  }

  private simpleTextCheck(userAnswer: string, expectedAnswer: string): boolean {
    // Простая проверка на основе длины и ключевых слов
    const userWords = userAnswer.toLowerCase().split(/\s+/);
    const expectedWords = expectedAnswer.toLowerCase().split(/\s+/);

    // Если ответ слишком короткий, считаем неправильным
    if (userAnswer.length < 10) return false;

    // Подсчитываем совпадения ключевых слов
    const commonWords = userWords.filter(
      (word) => word.length > 3 && expectedWords.includes(word),
    );

    // Если есть хотя бы 30% совпадений ключевых слов, считаем правильным
    const matchRatio = commonWords.length / Math.max(expectedWords.length, 1);
    return matchRatio >= 0.3;
  }
}
