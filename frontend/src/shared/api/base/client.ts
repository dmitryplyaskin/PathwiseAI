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

  /**
   * Получает CSRF токен из cookie
   */
  private getCsrfToken(): string | null {
    if (typeof document === 'undefined') {
      return null;
    }

    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'csrf-token') {
        return decodeURIComponent(value);
      }
    }
    return null;
  }

  /**
   * Получает CSRF токен с сервера, выполняя GET запрос
   */
  private async fetchCsrfToken(): Promise<string | null> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          ...this.defaultHeaders,
        },
      });

      const token = response.headers.get('X-CSRF-Token');
      return token;
    } catch {
      return null;
    }
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

    // Добавляем CSRF токен для state-changing методов
    const requestHeaders: Record<string, string> = {
      ...this.defaultHeaders,
      ...headers,
    };

    // CSRF защита требуется только для POST, PUT, PATCH, DELETE
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      let csrfToken = this.getCsrfToken();

      // Если токен отсутствует в cookie, пытаемся получить его с сервера
      if (!csrfToken) {
        csrfToken = await this.fetchCsrfToken();
      }

      if (csrfToken) {
        requestHeaders['X-CSRF-Token'] = csrfToken;
      }
    }

    const requestConfig: RequestInit = {
      method,
      headers: requestHeaders,
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

      // Если получили 403 из-за отсутствия CSRF токена, пытаемся получить токен и повторить запрос
      if (response.status === 403 && response.headers.get('X-CSRF-Token')) {
        const csrfToken = response.headers.get('X-CSRF-Token');
        if (csrfToken && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
          // Повторяем запрос с токеном из заголовка ответа
          requestHeaders['X-CSRF-Token'] = csrfToken;
          const retryResponse = await fetch(url, {
            ...requestConfig,
            headers: requestHeaders,
            ...(controller && { signal: controller.signal }),
          });

          if (timeoutId) {
            clearTimeout(timeoutId);
          }

          if (!retryResponse.ok) {
            const errorData = await this.parseErrorResponse(retryResponse);
            throw new ApiError(
              errorData.message || 'Ошибка запроса',
              errorData.code,
              retryResponse.status,
              errorData.details,
            );
          }

          const data = (await retryResponse.json()) as T;
          return data;
        }
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

      const data = (await response.json()) as T;
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
      const errorData = (await response.json()) as {
        message?: string;
        code?: string;
        details?: unknown;
      };
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
