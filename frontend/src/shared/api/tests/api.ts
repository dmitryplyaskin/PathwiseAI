import { apiClient } from '../config';
import {
  type TestData,
  type GenerateTestRequest,
  type SubmitTestResultRequest,
  type SubmitTestResultResponse,
  type CheckTextAnswerRequest,
  type CheckTextAnswerResponse,
  type ExamHistoryItem,
  type GetUserExamsRequest,
  type GetLessonExamsRequest,
  type DeleteLessonProgressRequest,
  type DeleteLessonProgressResponse,
} from './types';

export const testsApi = {
  generateTestForLesson: async (
    request: GenerateTestRequest,
  ): Promise<TestData> => {
    return apiClient.post<TestData>('/exams/generate-for-lesson', request);
  },

  submitTestResult: async (
    request: SubmitTestResultRequest,
  ): Promise<SubmitTestResultResponse> => {
    return apiClient.post<SubmitTestResultResponse>(
      '/exams/submit-result',
      request,
    );
  },

  checkTextAnswer: async (
    request: CheckTextAnswerRequest,
  ): Promise<CheckTextAnswerResponse> => {
    return apiClient.post<CheckTextAnswerResponse>(
      '/exams/check-text-answer',
      request,
    );
  },

  getUserExams: async (
    request: GetUserExamsRequest,
  ): Promise<ExamHistoryItem[]> => {
    return apiClient.get<ExamHistoryItem[]>(`/exams/user/${request.userId}`);
  },

  getLessonExams: async (
    request: GetLessonExamsRequest,
  ): Promise<ExamHistoryItem[]> => {
    return apiClient.get<ExamHistoryItem[]>(
      `/exams/lesson/${request.lessonId}/user/${request.userId}`,
    );
  },

  deleteLessonProgress: async (
    request: DeleteLessonProgressRequest,
  ): Promise<DeleteLessonProgressResponse> => {
    return apiClient.delete<DeleteLessonProgressResponse>(
      `/exams/lesson/${request.lessonId}/user/${request.userId}`,
    );
  },
};
