import {
  type TestData,
  type GenerateTestRequest,
  type SubmitTestResultRequest,
  type SubmitTestResultResponse,
  type CheckTextAnswerRequest,
  type CheckTextAnswerResponse,
} from './types';

const API_BASE_URL = 'http://localhost:3000/api';

export const testsApi = {
  generateTestForLesson: async (
    request: GenerateTestRequest,
  ): Promise<TestData> => {
    const response = await fetch(`${API_BASE_URL}/exams/generate-for-lesson`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Lesson not found');
      }
      throw new Error('Failed to generate test');
    }

    return response.json();
  },

  submitTestResult: async (
    request: SubmitTestResultRequest,
  ): Promise<SubmitTestResultResponse> => {
    const response = await fetch(`${API_BASE_URL}/exams/submit-result`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Failed to submit test result');
    }

    return response.json();
  },

  checkTextAnswer: async (
    request: CheckTextAnswerRequest,
  ): Promise<CheckTextAnswerResponse> => {
    const response = await fetch(`${API_BASE_URL}/exams/check-text-answer`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Failed to check text answer');
    }

    return response.json();
  },
};
