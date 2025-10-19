export type QuestionType = 'quiz' | 'text';

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface BaseQuestion {
  id: string;
  question: string;
}

export interface QuizQuestion extends BaseQuestion {
  type: 'quiz';
  options: QuizOption[];
}

export interface TextQuestion extends BaseQuestion {
  type: 'text';
  expectedAnswer?: string;
}

export type Question = QuizQuestion | TextQuestion;

export interface TestData {
  id: string;
  title: string;
  questions: Question[];
  lessonId?: string;
}

export interface QuestionAnswer {
  questionId: string;
  isCorrect: boolean;
  answer: string | null;
  llmExplanation?: string;
}

export interface TestResult {
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number; // в секундах
  answers: QuestionAnswer[];
}
