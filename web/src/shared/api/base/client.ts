import type { ApiRequestConfig, ApiClientConfig } from './types';

export class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;
  private csrfToken: string | null = null;
  private csrfTokenPromise: Promise<string | null> | null = null;

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
  private getCsrfTokenFromCookie(): string | null {
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
   * Инициализирует CSRF токен, запрашивая его с сервера
   * Использует кэширование и защиту от race conditions
   */
  private async initCsrfToken(): Promise<string | null> {
    // Если токен уже получен, возвращаем его
    if (this.csrfToken) {
      return this.csrfToken;
    }

    // Если уже идет запрос на получение токена, ждем его завершения
    if (this.csrfTokenPromise) {
      return this.csrfTokenPromise;
    }

    // Проверяем cookie перед запросом к серверу
    const cookieToken = this.getCsrfTokenFromCookie();
    if (cookieToken) {
      this.csrfToken = cookieToken;
      return cookieToken;
    }

    // Создаем promise для получения токена
    this.csrfTokenPromise = (async () => {
      try {
        // Используем легковесный эндпоинт для получения токена
        // CSRF middleware добавит токен в заголовок ответа
        const response = await fetch(`${this.baseUrl}/csrf-token`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            ...this.defaultHeaders,
          },
        });

        const token = response.headers.get('X-CSRF-Token');
        if (token) {
          this.csrfToken = token;
        }
        return token;
      } catch {
        // При ошибке пытаемся получить из cookie (на случай если сервер установил cookie)
        const fallbackToken = this.getCsrfTokenFromCookie();
        if (fallbackToken) {
          this.csrfToken = fallbackToken;
        }
        return fallbackToken;
      } finally {
        // Очищаем promise после завершения
        this.csrfTokenPromise = null;
      }
    })();

    return this.csrfTokenPromise;
  }

  /**
   * Получает CSRF токен для использования в запросах
   * Инициализирует токен при необходимости
   */
  private async getCsrfToken(): Promise<string | null> {
    // Сначала проверяем кэш
    if (this.csrfToken) {
      return this.csrfToken;
    }

    // Проверяем cookie
    const cookieToken = this.getCsrfTokenFromCookie();
    if (cookieToken) {
      this.csrfToken = cookieToken;
      return cookieToken;
    }

    // Инициализируем токен с сервера
    return this.initCsrfToken();
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
      const csrfToken = await this.getCsrfToken();
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
