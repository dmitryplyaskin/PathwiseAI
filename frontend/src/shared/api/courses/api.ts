import {
  type CourseListItem,
  type CreateModuleRequest,
  type CreateModuleResponse,
} from './types';

const API_BASE_URL = 'http://localhost:3000/api';

export const coursesApi = {
  getCoursesList: async (): Promise<CourseListItem[]> => {
    const response = await fetch(`${API_BASE_URL}/courses/list`);
    if (!response.ok) {
      throw new Error('Failed to fetch courses list');
    }
    return response.json();
  },

  createModule: async (
    data: CreateModuleRequest,
  ): Promise<CreateModuleResponse> => {
    const response = await fetch(`${API_BASE_URL}/courses/modules`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create module');
    }
    return response.json();
  },
};
