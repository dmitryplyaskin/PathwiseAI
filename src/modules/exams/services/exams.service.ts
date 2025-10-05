import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exam } from '../entities/exam.entity';
import { ExamResult } from '../entities/exam-result.entity';
import { CreateExamDto } from '../dto/create-exam.dto';
import { UpdateExamDto } from '../dto/update-exam.dto';
import { CreateExamResultDto } from '../dto/create-exam-result.dto';
import { UpdateExamResultDto } from '../dto/update-exam-result.dto';
import { GenerateTestDto } from '../dto/generate-test.dto';
import { SubmitTestResultDto } from '../dto/submit-test-result.dto';
import { Lesson } from '../../courses/entities/lesson.entity';
import { Question } from '../../questions/entities/question.entity';
import { QuestionType } from '../../questions/entities/question.entity';
import { OpenRouterService } from '../../chat/services/openrouter.service';
import { testGenerationPrompts } from '../config/test-generation.prompts';
import { testGenerationSchema } from '../config/test-generation.schema';
import { TestGenerationResponse } from '../config/test-generation.schema';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ExamsService {
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

    // Проверяем, есть ли уже тест для этого урока
    const existingExam = await this.examRepository.findOne({
      where: {
        user: { id: userId },
        course: { id: lessonId }, // Временно используем lessonId как courseId
      },
      relations: ['results', 'results.question'],
    });

    if (existingExam && existingExam.results.length > 0) {
      // Возвращаем существующий тест
      return this.formatTestForFrontend(existingExam);
    }

    // Получаем урок
    const lesson = await this.lessonRepository.findOne({
      where: { id: lessonId },
      relations: ['unit', 'unit.course'],
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson with ID "${lessonId}" not found`);
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
      status: 'in_progress' as any,
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
          ? (generatedQuestion.options as Record<string, any>)
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
        id: uuidv4(),
        options: q.options?.map((opt) => ({
          ...opt,
          id: uuidv4(),
        })),
      }));

      return testData;
    } catch (error) {
      console.error('Error generating test:', error);
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
              ? (q.options as any[]).map((opt: any, index: number) => ({
                  id: `opt${index + 1}`,
                  text: opt.text || opt,
                  isCorrect: opt.isCorrect || false,
                }))
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
    exam.status = 'completed' as any;
    exam.completed_at = new Date();
    await this.examRepository.save(exam);

    return {
      examId,
      score,
      correctAnswers,
      totalQuestions,
      timeSpent: parseInt(timeSpent),
      completedAt: exam.completed_at,
    };
  }
}
