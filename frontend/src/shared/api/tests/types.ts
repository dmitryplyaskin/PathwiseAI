// Re-export types from test widget
export type {
  TestData,
  Question,
  QuizOption,
  QuestionAnswer,
  TestResult,
} from '../../../widgets/test/types';

export interface GenerateTestRequest {
  lessonId: string;
  userId: string;
  questionCount?: number;
}

export interface SubmitTestResultRequest {
  examId: string;
  userId: string;
  answers: QuestionAnswerDto[];
  timeSpent: string;
}

export interface QuestionAnswerDto {
  questionId: string;
  answer: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface SubmitTestResultResponse {
  examId: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number;
  completedAt: string;
}

export interface CheckTextAnswerRequest {
  questionId: string;
  userAnswer: string;
  expectedAnswer: string;
  questionText: string;
}

export interface CheckTextAnswerResponse {
  isCorrect: boolean;
  score: number;
  explanation: string;
  feedback: string;
}
