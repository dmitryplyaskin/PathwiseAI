export enum LessonStatus {
  NOT_STARTED = 'not_started',
  LEARNING = 'learning',
  MASTERED = 'mastered',
}

export interface Course {
  id: string;
  title: string;
  description: string;
  status: string;
  progress: number;
  created_at: string;
  updated_at: string;
}

export interface Unit {
  id: string;
  title: string;
  order: number;
  course: Course;
  created_at: string;
}

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  content: string;
  reading_time?: number;
  difficulty?: number;
  order: number;
  status: LessonStatus;
  last_reviewed_at?: string;
  next_review_at?: string;
  ease_factor: number;
  interval: number;
  unit: Unit;
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
