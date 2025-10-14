import type { ApiRequestConfig, ApiClientConfig } from './types';

export class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(config: ApiClientConfig) {
    this.baseUrl = config.baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...config.defaultHeaders,
    };
  }

  private async request<T>(
    endpoint: string,
    config: ApiRequestConfig = {},
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const {
      method = 'GET',
      headers = {},
      body,
      credentials = 'include',
      timeout,
    } = config;

    const requestConfig: RequestInit = {
      method,
      headers: {
        ...this.defaultHeaders,
        ...headers,
      },
      credentials,
      ...(body !== undefined && { body: JSON.stringify(body) }),
    };

    // Создаем AbortController только если указан таймаут
    const controller = timeout ? new AbortController() : null;
    const timeoutId = timeout
      ? setTimeout(() => controller?.abort(), timeout)
      : null;

    try {
      const response = await fetch(url, {
        ...requestConfig,
        ...(controller && { signal: controller.signal }),
      });

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      if (!response.ok) {
        const errorData = await this.parseErrorResponse(response);
        throw new ApiError(
          errorData.message || 'Ошибка запроса',
          errorData.code,
          response.status,
          errorData.details,
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new ApiError('Превышено время ожидания запроса', 'TIMEOUT');
        }
        throw new ApiError(error.message, 'NETWORK_ERROR');
      }

      throw new ApiError('Неизвестная ошибка', 'UNKNOWN_ERROR');
    }
  }

  private async parseErrorResponse(response: Response): Promise<{
    message: string;
    code?: string;
    details?: unknown;
  }> {
    try {
      const errorData = await response.json();
      return {
        message: errorData.message || 'Ошибка сервера',
        code: errorData.code,
        details: errorData,
      };
    } catch {
      return {
        message: `HTTP ${response.status}: ${response.statusText}`,
        code: `HTTP_${response.status}`,
      };
    }
  }

  // HTTP методы
  async get<T>(
    endpoint: string,
    config?: Omit<ApiRequestConfig, 'method' | 'body'>,
  ): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  async post<T>(
    endpoint: string,
    body?: unknown,
    config?: Omit<ApiRequestConfig, 'method' | 'body'>,
  ): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'POST', body });
  }

  async put<T>(
    endpoint: string,
    body?: unknown,
    config?: Omit<ApiRequestConfig, 'method' | 'body'>,
  ): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'PUT', body });
  }

  async patch<T>(
    endpoint: string,
    body?: unknown,
    config?: Omit<ApiRequestConfig, 'method' | 'body'>,
  ): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'PATCH', body });
  }

  async delete<T>(
    endpoint: string,
    config?: Omit<ApiRequestConfig, 'method' | 'body'>,
  ): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }
}

// Класс для обработки ошибок API
export class ApiError extends Error {
  public readonly code?: string;
  public readonly status?: number;
  public readonly details?: unknown;

  constructor(
    message: string,
    code?: string,
    status?: number,
    details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.details = details;
  }

  // Проверка типа ошибки
  isUnauthorized(): boolean {
    return this.status === 401;
  }

  isForbidden(): boolean {
    return this.status === 403;
  }

  isNotFound(): boolean {
    return this.status === 404;
  }

  isServerError(): boolean {
    return this.status ? this.status >= 500 : false;
  }

  isClientError(): boolean {
    return this.status ? this.status >= 400 && this.status < 500 : false;
  }
}
