import { apiClient } from '../config';
import {
  type CourseListItem,
  type CreateModuleRequest,
  type CreateModuleResponse,
} from './types';

export const coursesApi = {
  getCoursesList: async (): Promise<CourseListItem[]> => {
    return apiClient.get<CourseListItem[]>('/courses/list');
  },

  createModule: async (
    data: CreateModuleRequest,
  ): Promise<CreateModuleResponse> => {
    return apiClient.post<CreateModuleResponse>('/courses/modules', data);
  },
};
