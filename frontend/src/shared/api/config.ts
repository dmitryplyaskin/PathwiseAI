import { ApiClient } from './base';
import type { ApiClientConfig } from './base';

const normalizeBaseUrl = (url: string) => url.replace(/\/+$/, '');

// Конфигурация API клиента
export const apiConfig: ApiClientConfig = {
  baseUrl: normalizeBaseUrl(
    import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api',
  ),
  defaultHeaders: {
    'Content-Type': 'application/json',
  },
};

// Создание экземпляра API клиента
export const apiClient = new ApiClient(apiConfig);
