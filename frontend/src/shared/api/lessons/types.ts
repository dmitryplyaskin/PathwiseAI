export enum LessonStatus {
  NOT_STARTED = 'not_started',
  LEARNING = 'learning',
  MASTERED = 'mastered',
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  order: number;
  status: LessonStatus;
  last_reviewed_at?: string;
  next_review_at?: string;
  ease_factor: number;
  interval: number;
  created_at: string;
  updated_at: string;
}

export interface LessonQuestionResponse {
  question: string;
  answer: string;
  lessonTitle: string;
  messageId: string;
  threadId: string;
}

export interface Thread {
  threadId: string;
  messageCount: number;
  firstMessage: string;
  createdAt: string;
  lastActivity: string;
}

export interface ThreadMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  threadId: string;
  created_at: string;
}
