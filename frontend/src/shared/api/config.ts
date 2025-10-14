import { ApiClient } from './base';
import type { ApiClientConfig } from './base';

// Конфигурация API клиента
export const apiConfig: ApiClientConfig = {
  baseUrl: 'http://localhost:3000/api',
  defaultHeaders: {
    'Content-Type': 'application/json',
  },
};

// Создание экземпляра API клиента
export const apiClient = new ApiClient(apiConfig);
