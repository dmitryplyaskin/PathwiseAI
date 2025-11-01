import { apiClient } from '../config';
import {
  type Lesson,
  type LessonQuestionResponse,
  type Thread,
  type ThreadMessage,
  type LessonForReview,
} from './types';

export const lessonsApi = {
  getAllLessons: async (): Promise<Lesson[]> => {
    return apiClient.get<Lesson[]>('/lessons');
  },

  getLessonById: async (id: string): Promise<Lesson> => {
    return apiClient.get<Lesson>(`/lessons/${id}`);
  },

  askQuestion: async (
    lessonId: string,
    question: string,
    threadId?: string,
    lessonContent?: string,
    userId?: string,
  ): Promise<LessonQuestionResponse> => {
    return apiClient.post<LessonQuestionResponse>(
      `/lessons/${lessonId}/ask`,
      {
        lessonId,
        question,
        threadId,
        lessonContent,
        userId,
      },
    );
  },

  getThreads: async (lessonId: string): Promise<Thread[]> => {
    return apiClient.get<Thread[]>(`/lessons/${lessonId}/threads`);
  },

  getThreadMessages: async (
    lessonId: string,
    threadId: string,
  ): Promise<ThreadMessage[]> => {
    return apiClient.get<ThreadMessage[]>(
      `/lessons/${lessonId}/threads/${threadId}`,
    );
  },

  deleteThread: async (
    lessonId: string,
    threadId: string,
  ): Promise<{ message: string; threadId: string }> => {
    return apiClient.delete<{ message: string; threadId: string }>(
      `/lessons/${lessonId}/threads/${threadId}`,
    );
  },

  regenerateMessage: async (
    lessonId: string,
    messageId: string,
  ): Promise<{ message: string; newMessage: ThreadMessage }> => {
    return apiClient.post<{ message: string; newMessage: ThreadMessage }>(
      `/lessons/${lessonId}/regenerate/${messageId}`,
    );
  },

  deleteLesson: async (lessonId: string): Promise<{ message: string }> => {
    return apiClient.delete<{ message: string }>(
      `/lessons/${lessonId}`,
    );
  },

  getLessonsForReview: async (userId: string): Promise<LessonForReview[]> => {
    return apiClient.get<LessonForReview[]>(
      `/lessons/for-review/${userId}`,
    );
  },
};
