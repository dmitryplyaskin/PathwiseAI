// Re-export types from test widget
export type {
  TestData,
  Question,
  QuizOption,
  QuestionAnswer,
  TestResult,
} from '@widgets/test/types';

export interface GenerateTestRequest {
  lessonId: string;
  questionCount?: number;
  mode?: 'normal' | 'detailed';
  questionTypes?: ('quiz' | 'text')[];
  forceNew?: boolean;
}

export interface SubmitTestResultRequest {
  examId: string;
  answers: QuestionAnswerDto[];
  timeSpent: number;
}

export interface QuestionAnswerDto {
  questionId: string;
  // Может быть пустой строкой, если вопрос пропущен
  answer?: string;
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

export interface ExamHistoryItem {
  id: string;
  title: string;
  score: number;
  status: 'completed' | 'in_progress' | 'cancelled';
  started_at: string;
  completed_at: string | null;
  course: {
    id: string;
    title: string;
  };
  results: {
    id: string;
    user_answer: string;
    is_correct: boolean;
    question: {
      id: string;
      question: string;
    };
  }[];
}

export interface GetLessonExamsRequest {
  lessonId: string;
}

export interface DeleteLessonProgressRequest {
  lessonId: string;
}

export interface DeleteLessonProgressResponse {
  message: string;
  deletedExamsCount: number;
}
