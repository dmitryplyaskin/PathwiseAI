// Базовые компоненты API
export { ApiClient, ApiError } from './base';
export type {
  ApiResponse,
  ApiError as ApiErrorType,
  PaginationParams,
  PaginatedResponse,
  ApiRequestConfig,
  ApiClientConfig,
} from './base';

// Конфигурация
export { apiClient, apiConfig } from './config';

// Хуки
export { useApi, useApiMutation, useApiQuery } from './hooks/use-api';
export type { UseApiState, UseApiOptions } from './hooks/use-api';

// API модули
export { usersApi } from './users/api';
export { testsApi } from './tests/api';
export { lessonsApi } from './lessons/api';
export { coursesApi } from './courses/api';

// Типы
export type * from './users/types';
export type * from './tests/types';
export type * from './lessons/types';
export type * from './courses/types';
