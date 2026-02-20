import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { Exam, ExamStatus } from '../entities/exam.entity';
import { ExamResult } from '../entities/exam-result.entity';
import { CreateExamDto } from '../dto/create-exam.dto';
import { UpdateExamDto } from '../dto/update-exam.dto';
import { CreateExamResultDto } from '../dto/create-exam-result.dto';
import { UpdateExamResultDto } from '../dto/update-exam-result.dto';
import { GenerateTestDto } from '../dto/generate-test.dto';
import { SubmitTestResultDto } from '../dto/submit-test-result.dto';
import { CheckTextAnswerDto } from '../dto/check-text-answer.dto';
import { Lesson, LessonStatus } from '../../courses/entities/lesson.entity';
import { Question, QuestionType } from '../../questions/entities/question.entity';
import { OpenRouterService } from '../../chat/services/openrouter.service';
import { SM2SpacedRepetitionService } from '../../courses/services/sm2-spaced-repetition.service';
import { testGenerationPrompts } from '../config/test-generation.prompts';
import {
  testGenerationSchema,
  TestGenerationResponse,
} from '../config/test-generation.schema';
import { textCheckingPrompts } from '../config/text-checking.prompts';
import {
  textCheckingSchema,
  TextCheckingResponse,
} from '../config/text-checking.schema';
import { AccessControlService } from '../../../shared/services/access-control.service';

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
    private readonly accessControlService: AccessControlService,
    private readonly dataSource: DataSource,
  ) {}

  async createExam(createExamDto: CreateExamDto, userId: string) {
    await this.assertLessonAccess(createExamDto.lessonId, userId);

    const exam = this.examRepository.create({
      ...createExamDto,
      user: { id: userId },
      course: { id: createExamDto.courseId },
      lesson: { id: createExamDto.lessonId },
      lessonId: createExamDto.lessonId,
    });
    return this.examRepository.save(exam);
  }

  findAllExams(userId: string) {
    return this.findExamsByUser(userId);
  }

  async findExamsByUser(userId: string) {
    return this.examRepository.find({
      where: { user: { id: userId } },
      relations: ['results', 'results.question', 'course', 'lesson'],
      order: { completed_at: 'DESC' },
    });
  }

  async findExamsByLesson(lessonId: string, userId: string) {
    await this.assertLessonAccess(lessonId, userId);

    return this.examRepository.find({
      where: {
        user: { id: userId },
        lesson: { id: lessonId },
      },
      relations: ['results', 'results.question', 'course', 'lesson'],
      order: { completed_at: 'DESC' },
    });
  }

  async findOneExam(id: string, userId: string) {
    const exam = await this.examRepository.findOne({
      where: {
        id,
        user: { id: userId },
      },
      relations: ['results', 'results.question', 'course', 'lesson'],
    });

    if (!exam) {
      throw new NotFoundException(`Exam with ID "${id}" not found`);
    }

    return exam;
  }

  async updateExam(id: string, updateExamDto: UpdateExamDto, userId: string) {
    await this.findOneExam(id, userId);
    await this.examRepository.update(id, updateExamDto);
    return this.findOneExam(id, userId);
  }

  async removeExam(id: string, userId: string) {
    await this.findOneExam(id, userId);
    return this.examRepository.delete(id);
  }

  async createExamResult(createExamResultDto: CreateExamResultDto, userId: string) {
    const exam = await this.findOneExam(createExamResultDto.examId, userId);

    const examResult = this.examResultRepository.create({
      ...createExamResultDto,
      exam: { id: exam.id },
      question: { id: createExamResultDto.questionId },
    });
    return this.examResultRepository.save(examResult);
  }

  findAllExamResults(userId: string) {
    return this.examResultRepository.find({
      where: {
        exam: { user: { id: userId } },
      },
      relations: ['exam', 'question'],
    });
  }

  async findOneExamResult(id: string, userId: string) {
    const examResult = await this.examResultRepository.findOne({
      where: {
        id,
        exam: { user: { id: userId } },
      },
      relations: ['exam', 'question'],
    });

    if (!examResult) {
      throw new NotFoundException(`ExamResult with ID "${id}" not found`);
    }

    return examResult;
  }

  async updateExamResult(
    id: string,
    updateExamResultDto: UpdateExamResultDto,
    userId: string,
  ) {
    await this.findOneExamResult(id, userId);
    await this.examResultRepository.update(id, updateExamResultDto);
    return this.findOneExamResult(id, userId);
  }

  async removeExamResult(id: string, userId: string) {
    await this.findOneExamResult(id, userId);
    return this.examResultRepository.delete(id);
  }

  async getOrGenerateTestForLesson(generateTestDto: GenerateTestDto, userId: string) {
    const { lessonId, questionCount, mode, questionTypes, forceNew } =
      generateTestDto;

    const lesson = await this.getLessonForExamGeneration(lessonId, userId);

    if (!forceNew) {
      const existingExams = await this.examRepository.find({
        where: {
          user: { id: userId },
          lesson: { id: lesson.id },
        },
        relations: ['results', 'results.question'],
        order: { started_at: 'DESC' },
      });

      if (existingExams.length > 0) {
        const lastExam = existingExams[0];
        const existingQuestions = lastExam.results.map((result) => result.question);
        return this.formatTestForFrontend(lastExam, existingQuestions);
      }
    }

    const count = mode === 'detailed' ? 10 : questionCount || 5;
    const generatedTest = await this.generateTestForLesson(
      lesson,
      count,
      questionTypes,
    );

    return this.dataSource.transaction(async (manager) => {
      const examRepository = manager.getRepository(Exam);
      const questionRepository = manager.getRepository(Question);
      const examResultRepository = manager.getRepository(ExamResult);

      const exam = examRepository.create({
        user: { id: userId },
        course: { id: lesson.unit.course.id },
        lesson: { id: lesson.id },
        lessonId: lesson.id,
        title: generatedTest.title,
        status: ExamStatus.IN_PROGRESS,
        started_at: new Date(),
      });

      const savedExam = await examRepository.save(exam);

      const questions: Question[] = [];
      for (const generatedQuestion of generatedTest.questions) {
        const question = questionRepository.create({
          lesson: { id: lessonId },
          question_text: generatedQuestion.question,
          question_content: generatedQuestion.questionContent || null,
          question_type:
            generatedQuestion.type === 'quiz'
              ? QuestionType.MULTIPLE_CHOICE
              : QuestionType.OPEN_ENDED,
          options: generatedQuestion.options
            ? (generatedQuestion.options as unknown as Record<string, unknown>)
            : undefined,
          correct_answer:
            generatedQuestion.type === 'quiz'
              ? generatedQuestion.options?.find((opt) => opt.isCorrect)?.text || ''
              : generatedQuestion.expectedAnswer || '',
          explanation: generatedQuestion.explanation,
        });

        const savedQuestion = await questionRepository.save(question);
        questions.push(savedQuestion);
      }

      for (const question of questions) {
        const examResult = examResultRepository.create({
          exam: { id: savedExam.id },
          question: { id: question.id },
          user_answer: '',
          is_correct: false,
        });
        await examResultRepository.save(examResult);
      }

      return this.formatTestForFrontend(savedExam, questions);
    });
  }

  private async generateTestForLesson(
    lesson: Lesson,
    questionCount: number,
    questionTypes?: ('quiz' | 'text')[],
  ): Promise<TestGenerationResponse> {
    let typeInstruction = '';
    if (questionTypes && questionTypes.length > 0) {
      if (questionTypes.includes('quiz') && !questionTypes.includes('text')) {
        typeInstruction =
          testGenerationPrompts.questionTypeInstructions.quizOnly;
      } else if (
        questionTypes.includes('text') &&
        !questionTypes.includes('quiz')
      ) {
        typeInstruction =
          testGenerationPrompts.questionTypeInstructions.textOnly;
      } else {
        typeInstruction = testGenerationPrompts.questionTypeInstructions.mixed;
      }
    }

    const userPrompt =
      testGenerationPrompts.userPromptTemplate
        .replace('${lessonTitle}', lesson.title)
        .replace('${lessonContent}', lesson.content)
        .replace('${questionCount}', questionCount.toString()) +
      `\n\n${typeInstruction}`;

    const messages = [
      { role: 'system', content: testGenerationPrompts.systemPrompt },
      { role: 'user', content: userPrompt },
    ];

    try {
      const response = await this.openRouterService.generateResponse(messages, {
        response_format: testGenerationSchema,
      });

      const testData = JSON.parse(response) as TestGenerationResponse;

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
          questionContent: q.question_content || undefined,
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

  async submitTestResult(submitTestResultDto: SubmitTestResultDto, userId: string) {
    const { examId, answers, timeSpent } = submitTestResultDto;

    const exam = await this.examRepository.findOne({
      where: { id: examId, user: { id: userId } },
      relations: ['results', 'results.question', 'lesson'],
    });

    if (!exam) {
      throw new NotFoundException(`Exam with ID "${examId}" not found`);
    }

    const submittedAnswersByQuestionId = new Map(
      answers.map((answer) => [answer.questionId, answer]),
    );

    let correctAnswers = 0;
    for (const examResult of exam.results) {
      const submitted = submittedAnswersByQuestionId.get(examResult.question.id);
      examResult.user_answer = submitted?.answer ?? '';

      // Для quiz/true_false проверяем корректность на сервере, чтобы не доверять флагу клиента.
      if (
        examResult.question.question_type === QuestionType.MULTIPLE_CHOICE ||
        examResult.question.question_type === QuestionType.TRUE_FALSE
      ) {
        const normalizedUserAnswer = examResult.user_answer.trim().toLowerCase();
        const normalizedCorrectAnswer =
          examResult.question.correct_answer.trim().toLowerCase();
        examResult.is_correct = normalizedUserAnswer === normalizedCorrectAnswer;
      } else {
        examResult.is_correct = submitted?.isCorrect ?? false;
      }

      if (examResult.is_correct) {
        correctAnswers++;
      }

      await this.examResultRepository.save(examResult);
    }

    const totalQuestions = exam.results.length;
    const score = totalQuestions === 0 ? 0 : (correctAnswers / totalQuestions) * 100;

    exam.score = score;
    exam.status = ExamStatus.COMPLETED;
    exam.completed_at = new Date();
    await this.examRepository.save(exam);

    await this.updateLessonProgress(exam, score, totalQuestions, correctAnswers);

    return {
      examId,
      score,
      correctAnswers,
      totalQuestions,
      timeSpent,
      completedAt: exam.completed_at,
    };
  }

  private async updateLessonProgress(
    exam: Exam,
    score: number,
    totalQuestions?: number,
    correctAnswers?: number,
  ) {
    if (!exam.lessonId) {
      this.logger.warn({ examId: exam.id }, 'Exam lesson_id is missing');
      return;
    }

    const lesson = await this.lessonRepository.findOne({
      where: { id: exam.lessonId },
    });

    if (!lesson) {
      this.logger.warn(
        { lessonId: exam.lessonId, examId: exam.id },
        'Lesson for exam not found',
      );
      return;
    }

    const questionCount = totalQuestions || exam.results?.length || 5;

    const sm2Result = this.sm2Service.calculateNextReview(
      lesson.status,
      lesson.interval,
      lesson.ease_factor,
      lesson.repetitions ?? 0,
      score,
      questionCount,
      lesson.last_reviewed_at || undefined,
      correctAnswers,
    );

    await this.lessonRepository.update(lesson.id, {
      status: sm2Result.status,
      interval: sm2Result.interval,
      ease_factor: sm2Result.easeFactor,
      repetitions: sm2Result.repetitions,
      last_reviewed_at: new Date(),
      next_review_at: sm2Result.nextReviewAt,
    });
  }

  async checkTextAnswer(
    checkTextAnswerDto: CheckTextAnswerDto,
  ): Promise<TextCheckingResponse> {
    const { userAnswer, expectedAnswer, questionText } = checkTextAnswerDto;

    if (userAnswer.trim().length === 0) {
      return {
        isCorrect: false,
        score: 0,
        explanation:
          'Ответ пустой или содержит только пробелы. Это не является ответом на вопрос.',
        feedback: 'Пожалуйста, напишите содержательный ответ по теме вопроса.',
      };
    }

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

      if (typeof checkingResult.isCorrect !== 'boolean') {
        checkingResult.isCorrect = false;
      }

      if (
        typeof checkingResult.score !== 'number' ||
        checkingResult.score < 0 ||
        checkingResult.score > 100
      ) {
        checkingResult.score = checkingResult.isCorrect ? 85 : 30;
      }

      checkingResult.score = Math.max(0, Math.min(100, checkingResult.score));
      checkingResult.isCorrect = checkingResult.score >= 70;

      return checkingResult;
    } catch (error) {
      const errorObj =
        error instanceof Error ? error : new Error(String(error));
      this.logger.error(
        { err: errorObj, questionText, userAnswer },
        'Error checking text answer',
      );

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
    const userWords = userAnswer.toLowerCase().split(/\s+/);
    const expectedWords = expectedAnswer.toLowerCase().split(/\s+/);

    if (userAnswer.length < 10) {
      return false;
    }

    const commonWords = userWords.filter(
      (word) => word.length > 3 && expectedWords.includes(word),
    );

    const matchRatio = commonWords.length / Math.max(expectedWords.length, 1);
    return matchRatio >= 0.3;
  }

  async deleteExamsByLesson(lessonId: string, userId: string) {
    const lesson = await this.lessonRepository.findOne({
      where: { id: lessonId },
      relations: ['user'],
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson with ID "${lessonId}" not found`);
    }

    if (lesson.user.id !== userId) {
      throw new ForbiddenException('You can only reset progress for your own lesson');
    }

    const exams = await this.examRepository.find({
      where: {
        user: { id: userId },
        lesson: { id: lessonId },
      },
      relations: ['results'],
    });

    await this.dataSource.transaction(async (manager) => {
      const examResultRepository = manager.getRepository(ExamResult);
      const examRepository = manager.getRepository(Exam);

      for (const exam of exams) {
        const examResults = await examResultRepository.find({
          where: { exam: { id: exam.id } },
        });

        if (examResults.length > 0) {
          const resultIds = examResults.map((result) => result.id);
          await examResultRepository.delete(resultIds);
        }

        await examRepository.delete(exam.id);
      }
    });

    await this.resetLessonProgress(lessonId);

    return {
      message: 'Progress reset successfully',
      deletedExamsCount: exams.length,
    };
  }

  private async resetLessonProgress(lessonId: string) {
    const lesson = await this.lessonRepository.findOne({
      where: { id: lessonId },
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson with ID "${lessonId}" not found`);
    }

    await this.lessonRepository.update(lessonId, {
      status: LessonStatus.NOT_STARTED,
      interval: 0,
      ease_factor: 2.5,
      repetitions: 0,
      last_reviewed_at: null,
      next_review_at: null,
    });
  }

  private async assertLessonAccess(lessonId: string, userId: string): Promise<void> {
    const hasAccess = await this.accessControlService.checkLessonAccess(
      lessonId,
      userId,
    );

    if (!hasAccess) {
      throw new ForbiddenException('You do not have access to this lesson');
    }
  }

  private async getLessonForExamGeneration(lessonId: string, userId: string) {
    await this.assertLessonAccess(lessonId, userId);

    const lesson = await this.lessonRepository.findOne({
      where: { id: lessonId },
      relations: ['unit', 'unit.course'],
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson with ID "${lessonId}" not found`);
    }

    return lesson;
  }
}
