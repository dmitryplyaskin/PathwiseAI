# Модуль чата PathwiseAI

## Описание

Модуль чата предоставляет интеграцию с AI-помощником через OpenRouter API. Каждый урок имеет свой уникальный чат, где студенты могут задавать вопросы и получать помощь от AI.

## Настройка

### 1. Переменные окружения

Скопируйте `env.example` в `.env` и заполните следующие переменные:

```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_MODEL=anthropic/claude-3.5-sonnet
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_APP_NAME=PathwiseAI
OPENROUTER_SITE_URL=http://localhost:3000
```

### 2. Получение API ключа

1. Зарегистрируйтесь на [OpenRouter](https://openrouter.ai/)
2. Получите API ключ в разделе "API Keys"
3. Добавьте ключ в переменную `OPENROUTER_API_KEY`

### 3. Выбор модели

Доступные модели:

- `anthropic/claude-3.5-sonnet` (рекомендуется)
- `openai/gpt-4-turbo`
- `openai/gpt-3.5-turbo`
- `anthropic/claude-3-opus`
- `meta-llama/llama-3.1-70b-instruct`

## API Endpoints

### POST /chat/message

Отправить сообщение в чат урока

```json
{
  "lessonId": "uuid",
  "userId": "uuid", // опционально
  "content": "Текст сообщения"
}
```

### POST /chat/message/stream

Отправить сообщение в чат урока с потоковым ответом (Server-Sent Events)

```json
{
  "lessonId": "uuid",
  "userId": "uuid", // опционально
  "content": "Текст сообщения"
}
```

### GET /chat/messages?lessonId=uuid

Получить все сообщения чата урока

### GET /chat/messages/:lessonId

Получить все сообщения чата урока (альтернативный способ)

### DELETE /chat/:lessonId

Удалить весь чат урока

### DELETE /chat/:lessonId/messages

Очистить историю сообщений чата урока

## Структура базы данных

### Таблица chats

- `id` - UUID чата
- `lesson_id` - UUID урока
- `created_at` - дата создания
- `updated_at` - дата обновления

### Таблица chat_messages

- `id` - UUID сообщения
- `chat_id` - UUID чата
- `user_id` - UUID пользователя (nullable)
- `role` - роль отправителя (user/assistant/system)
- `content` - содержимое сообщения
- `created_at` - дата создания

## Особенности

- Каждый урок автоматически получает свой уникальный чат
- AI-помощник сохраняет контекст разговора в рамках урока
- Поддержка стриминга ответов (метод `generateStreamResponse`)
- Система ролей для разграничения сообщений пользователей и AI
