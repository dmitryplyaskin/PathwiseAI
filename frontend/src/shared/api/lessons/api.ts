import { type Lesson } from './types';

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
};
