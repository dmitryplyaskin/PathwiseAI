import {
  type Lesson,
  type LessonQuestionResponse,
  type Thread,
  type ThreadMessage,
} from './types';

const API_BASE_URL = 'http://localhost:3000/api';

export const lessonsApi = {
  getAllLessons: async (): Promise<Lesson[]> => {
    const response = await fetch(`${API_BASE_URL}/courses/lessons`);
    if (!response.ok) {
      throw new Error('Failed to fetch lessons');
    }
    return response.json();
  },

  getLessonById: async (id: string): Promise<Lesson> => {
    const response = await fetch(`${API_BASE_URL}/courses/lessons/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Lesson not found');
      }
      throw new Error('Failed to fetch lesson');
    }
    return response.json();
  },

  askQuestion: async (
    lessonId: string,
    question: string,
    threadId?: string,
    lessonContent?: string,
    userId?: string,
  ): Promise<LessonQuestionResponse> => {
    const response = await fetch(
      `${API_BASE_URL}/courses/lessons/${lessonId}/ask`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lessonId,
          question,
          threadId,
          lessonContent,
          userId,
        }),
      },
    );
    if (!response.ok) {
      throw new Error('Failed to send question');
    }
    return response.json();
  },

  getThreads: async (lessonId: string): Promise<Thread[]> => {
    const response = await fetch(
      `${API_BASE_URL}/courses/lessons/${lessonId}/threads`,
    );
    if (!response.ok) {
      throw new Error('Failed to fetch threads');
    }
    return response.json();
  },

  getThreadMessages: async (
    lessonId: string,
    threadId: string,
  ): Promise<ThreadMessage[]> => {
    const response = await fetch(
      `${API_BASE_URL}/courses/lessons/${lessonId}/threads/${threadId}`,
    );
    if (!response.ok) {
      throw new Error('Failed to fetch thread messages');
    }
    return response.json();
  },

  deleteThread: async (
    lessonId: string,
    threadId: string,
  ): Promise<{ message: string; threadId: string }> => {
    const response = await fetch(
      `${API_BASE_URL}/courses/lessons/${lessonId}/threads/${threadId}`,
      { method: 'DELETE' },
    );
    if (!response.ok) {
      throw new Error('Failed to delete thread');
    }
    return response.json();
  },

  regenerateMessage: async (
    lessonId: string,
    messageId: string,
  ): Promise<{ message: string; newMessage: ThreadMessage }> => {
    const response = await fetch(
      `${API_BASE_URL}/courses/lessons/${lessonId}/regenerate/${messageId}`,
      { method: 'POST' },
    );
    if (!response.ok) {
      throw new Error('Failed to regenerate message');
    }
    return response.json();
  },

  deleteLesson: async (lessonId: string): Promise<{ message: string }> => {
    const response = await fetch(
      `${API_BASE_URL}/courses/lessons/${lessonId}`,
      {
        method: 'DELETE',
      },
    );
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Lesson not found');
      }
      throw new Error('Failed to delete lesson');
    }
    return response.json();
  },
};
