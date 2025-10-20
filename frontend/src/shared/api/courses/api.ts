import { apiClient } from '../config';
import {
  type CourseListItem,
  type CreateModuleRequest,
  type CreateModuleResponse,
  type CreateCourseOutlineRequest,
  type CreateCourseOutlineResponse,
  type CourseDetail,
  type LessonDetail,
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

  createCourseOutline: async (
    data: CreateCourseOutlineRequest,
  ): Promise<CreateCourseOutlineResponse> => {
    return apiClient.post<CreateCourseOutlineResponse>(
      '/courses/outlines',
      data,
    );
  },

  getCourseDetail: async (courseId: string): Promise<CourseDetail> => {
    return apiClient.get<CourseDetail>(`/courses/${courseId}`);
  },

  getLessonDetail: async (lessonId: string): Promise<LessonDetail> => {
    return apiClient.get<LessonDetail>(`/courses/lessons/${lessonId}`);
  },

  getCourseLessons: async (courseId: string): Promise<LessonDetail[]> => {
    return apiClient.get<LessonDetail[]>(`/courses/${courseId}/lessons`);
  },
};
