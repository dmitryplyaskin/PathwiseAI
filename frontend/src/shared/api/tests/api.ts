import { apiClient } from '../config';
import {
  type TestData,
  type GenerateTestRequest,
  type SubmitTestResultRequest,
  type SubmitTestResultResponse,
  type CheckTextAnswerRequest,
  type CheckTextAnswerResponse,
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
};
