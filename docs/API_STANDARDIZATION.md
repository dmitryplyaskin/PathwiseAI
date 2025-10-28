# Стандартизация API

## Обзор

Проект использует стандартизированный подход к работе с API через единый клиент и хуки для управления состоянием.

## Структура

### Базовые компоненты

- `frontend/src/shared/api/base/` - Базовые типы и клиент
- `frontend/src/shared/api/config.ts` - Конфигурация API клиента
- `frontend/src/shared/api/hooks/` - React хуки для работы с API
- `frontend/src/shared/api/index.ts` - Главный экспорт

### API модули

- `frontend/src/shared/api/users/` - API для работы с пользователями
- `frontend/src/shared/api/tests/` - API для работы с тестами
- `frontend/src/shared/api/lessons/` - API для работы с уроками

## ApiClient

Центральный класс для всех HTTP запросов.

### Основные методы

- `get<T>(endpoint, config?)` - GET запрос
- `post<T>(endpoint, body?, config?)` - POST запрос
- `put<T>(endpoint, body?, config?)` - PUT запрос
- `patch<T>(endpoint, body?, config?)` - PATCH запрос
- `delete<T>(endpoint, config?)` - DELETE запрос

### CSRF защита

ApiClient автоматически управляет CSRF токенами для state-changing методов (POST, PUT, PATCH, DELETE).

**Механизм работы:**

- Токен кэшируется в памяти клиента после первого получения
- При отсутствии токена в кэше проверяются cookie браузера
- Если токен отсутствует, выполняется запрос к `/api/csrf-token` для получения токена
- Защита от race conditions: одновременные запросы используют один и тот же promise получения токена
- Токен автоматически добавляется в заголовок `X-CSRF-Token` для всех мутаций

**Реализация:**

- Файл: `frontend/src/shared/api/base/client.ts`
- Методы: `getCsrfToken()`, `initCsrfToken()`, `getCsrfTokenFromCookie()`
- Бэкенд эндпоинт: `GET /api/csrf-token` (`src/shared/controllers/csrf.controller.ts`)

### Обработка ошибок

Все ошибки оборачиваются в `ApiError` с методами:

- `isUnauthorized()` - 401 ошибка
- `isForbidden()` - 403 ошибка
- `isNotFound()` - 404 ошибка
- `isServerError()` - 5xx ошибки
- `isClientError()` - 4xx ошибки

## React хуки

### useApi

Базовый хук для работы с API.

```typescript
const { data, loading, error, execute, reset } = useApi(apiCall, {
  immediate: false,
  onSuccess: (data) => console.log(data),
  onError: (error) => console.error(error),
});
```

### useApiMutation

Хук для мутаций (POST, PUT, DELETE).

```typescript
const { data, loading, error, execute } = useApiMutation(usersApi.login);
```

### useApiQuery

Хук для запросов (GET).

```typescript
const { data, loading, error } = useApiQuery(lessonsApi.getAllLessons);
```

## Конфигурация

### Базовая конфигурация

```typescript
export const apiConfig: ApiClientConfig = {
  baseUrl: 'http://localhost:3000/api',
  defaultHeaders: {
    'Content-Type': 'application/json',
  },
};
```

### Создание клиента

```typescript
export const apiClient = new ApiClient(apiConfig);
```

## Типы

### ApiResponse

Стандартный формат ответа API.

```typescript
interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}
```

### PaginatedResponse

Формат для пагинированных ответов.

```typescript
interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

## Примеры использования

### Простой запрос

```typescript
import { usersApi } from '@/shared/api';

const user = await usersApi.getProfile();
```

### Запрос с таймаутом

```typescript
import { apiClient } from '@/shared/api';

// Запрос с таймаутом 30 секунд
const response = await apiClient.post('/some-endpoint', data, {
  timeout: 30000,
});

// LLM запрос с увеличенным таймаутом (5 минут)
const aiResponse = await apiClient.post('/chat/message', messageData, {
  timeout: 300000,
});
```

### С обработкой ошибок

```typescript
import { usersApi, ApiError } from '@/shared/api';

try {
  const user = await usersApi.getProfile();
} catch (error) {
  if (error instanceof ApiError) {
    if (error.isUnauthorized()) {
      // Перенаправить на страницу входа
    }
    if (error.code === 'TIMEOUT') {
      // Обработка таймаута
    }
  }
}
```

### С использованием хуков

```typescript
import { useApiQuery } from '@/shared/api';
import { lessonsApi } from '@/shared/api';

function LessonsList() {
  const { data: lessons, loading, error } = useApiQuery(lessonsApi.getAllLessons);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error.message}</div>;

  return (
    <div>
      {lessons?.map(lesson => (
        <div key={lesson.id}>{lesson.title}</div>
      ))}
    </div>
  );
}
```

## Преимущества

1. **Единообразие** - все API используют одинаковый подход
2. **Типизация** - полная поддержка TypeScript
3. **Обработка ошибок** - централизованная обработка ошибок
4. **Повторное использование** - легко создавать новые API модули
5. **Тестируемость** - легко мокать и тестировать
6. **Производительность** - оптимизированные запросы с таймаутами
7. **CSRF защита** - эффективное управление токенами с кэшированием и защитой от race conditions
