import { type Lesson, type LessonQuestionResponse } from './types';

const API_BASE_URL = 'http://localhost:3000';

export const lessonsApi = {
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
    userId?: string,
  ): Promise<LessonQuestionResponse> => {
    const response = await fetch(
      `${API_BASE_URL}/courses/lessons/${lessonId}/ask`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lessonId, question, userId }),
      },
    );
    if (!response.ok) {
      throw new Error('Failed to send question');
    }
    return response.json();
  },
};
