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
    return apiClient.get<Lesson[]>('/courses/lessons');
  },

  getLessonById: async (id: string): Promise<Lesson> => {
    return apiClient.get<Lesson>(`/courses/lessons/${id}`);
  },

  askQuestion: async (
    lessonId: string,
    question: string,
    threadId?: string,
    lessonContent?: string,
    userId?: string,
  ): Promise<LessonQuestionResponse> => {
    return apiClient.post<LessonQuestionResponse>(
      `/courses/lessons/${lessonId}/ask`,
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
    return apiClient.get<Thread[]>(`/courses/lessons/${lessonId}/threads`);
  },

  getThreadMessages: async (
    lessonId: string,
    threadId: string,
  ): Promise<ThreadMessage[]> => {
    return apiClient.get<ThreadMessage[]>(
      `/courses/lessons/${lessonId}/threads/${threadId}`,
    );
  },

  deleteThread: async (
    lessonId: string,
    threadId: string,
  ): Promise<{ message: string; threadId: string }> => {
    return apiClient.delete<{ message: string; threadId: string }>(
      `/courses/lessons/${lessonId}/threads/${threadId}`,
    );
  },

  regenerateMessage: async (
    lessonId: string,
    messageId: string,
  ): Promise<{ message: string; newMessage: ThreadMessage }> => {
    return apiClient.post<{ message: string; newMessage: ThreadMessage }>(
      `/courses/lessons/${lessonId}/regenerate/${messageId}`,
    );
  },

  deleteLesson: async (lessonId: string): Promise<{ message: string }> => {
    return apiClient.delete<{ message: string }>(
      `/courses/lessons/${lessonId}`,
    );
  },

  getLessonsForReview: async (userId: string): Promise<LessonForReview[]> => {
    return apiClient.get<LessonForReview[]>(
      `/courses/lessons/for-review/${userId}`,
    );
  },
};
