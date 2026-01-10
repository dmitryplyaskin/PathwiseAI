# Backend code review (src) — 2026-01-10

Цель: оценить качество кода бэкенда в `src/`, выявить риски, потенциальные баги и зоны для улучшения.

Контекст (по коду/зависимостям):

- NestJS 11 (`@nestjs/*`)
- TypeORM + `typeorm-pglite` (встроенный PostgreSQL-совместимый драйвер)
- JWT auth (cookie + Bearer), `passport-jwt`, `passport-local`
- Глобальная валидация DTO через `ValidationPipe` (`whitelist`, `forbidNonWhitelisted`, `transform`)
- Логирование через `nestjs-pino` (но местами используются `Logger`/`console`)
- Глобальная CSRF-защита через `CsrfGuard` (double submit cookie)

## Итоговая оценка (мнение)

**4/10 для продакшена** (в текущем виде) и **7/10 для прототипа**.

Сильные стороны: проект уже близок к “правильному” NestJS-подходу (модули, DTO, валидаторы, `ParseUUIDPipe`, попытки централизовать access-control и CSRF, pino-логирование).

Ключевая проблема: **сквозная авторизация/аутентификация сделана непоследовательно** — есть endpoints, где можно читать/изменять данные других пользователей или вообще работать без JWT (что критично, особенно при наличии интеграции с платными AI API).

## Что сделано хорошо

- **Глобальный `ValidationPipe`** в `src/main.ts` (whitelist/forbidNonWhitelisted/transform) — хорошая базовая защита API.
- **UUID валидация на уровне роутинга**: многие контроллеры используют `ParseUUIDPipe`.
- **CSRF-guard включён глобально** (`APP_GUARD`) + middleware, выставляющий `csrf-token` cookie и header (`src/shared/*`).
- **Структура модулей** понятная: `auth`, `users`, `courses`, `lessons`, `units`, `exams`, `chat`, `shared`.
- **Логирование через pino** присутствует (HTTP), а в AI местах есть структурные `logger.error(...)`.

## Критические проблемы (с высокой вероятностью эксплуатации/ущерба)

### 1) Отсутствие аутентификации на Chat API (любой может дергать AI/удалять чаты)

**Файлы:**

- `src/modules/chat/controllers/chat.controller.ts` — нет `@UseGuards(JwtAuthGuard)` вообще ни на уровне класса, ни на методах.

**Последствия:**

- Любой клиент может вызывать `POST /api/chat/message` и `POST /api/chat/message/stream`, провоцируя запросы в OpenRouter/OpenAI (финансовый риск).
- Любой клиент может удалять/очищать чаты по `lessonId` (`DELETE /api/chat/:lessonId`, `DELETE /api/chat/:lessonId/messages`).

**Причина:** `CsrfGuard` не заменяет аутентификацию. Сейчас CSRF токен выдаётся всем через middleware, поэтому “порог” атаки низкий.

### 2) Горизонтальная эскалация прав из-за доверия `userId` из URL/Body

Паттерн повторяется: `userId` передаётся клиентом (в URL или Body) и используется для чтения/записи данных, без жёсткой привязки к `@CurrentUser()`.

**Примеры:**

- `src/modules/exams/controllers/exams.controller.ts`
  - `GET /exams/user/:userId` — можно получить экзамены любого пользователя.
  - `GET /exams/lesson/:lessonId/user/:userId` — аналогично.
  - `POST /exams/generate-for-lesson` принимает `GenerateTestDto` с `userId` из body и передаёт его в сервис без перезаписи.
- `src/modules/courses/controllers/lessons.controller.ts`
  - `GET /lessons/for-review/:userId` — запрос прогресса по произвольному `userId`.
  - `POST /lessons/modules` — `CreateModuleDto` требует `userId` в body и он используется в `LessonsService`.
- `src/modules/questions/services/questions.service.ts`
  - `createUserAnswer` сохраняет `user: { id: createUserAnswerDto.userId }` (т.е. можно писать ответы “от имени” другого пользователя).
- `src/modules/courses/controllers/courses.controller.ts`
  - `POST /courses` принимает `CreateCourseDto` с `userId` из body и передаёт дальше без перезаписи.

**Последствия:**

- Чтение чужих данных (прогресс, тесты, ответы).
- Запись/создание сущностей “от имени” другого пользователя (курсы, экзамены, ответы).

### 3) Users API позволяет любому авторизованному пользователю управлять любыми аккаунтами

**Файл:** `src/modules/users/controllers/users.controller.ts`

- `GET /users` — выдаёт список всех пользователей.
- `PATCH /users/:id` — обновляет произвольного пользователя.
- `DELETE /users/:id` — удаляет произвольного пользователя.

**Последствия:** утечки персональных данных, удаление/изменение чужих аккаунтов.

## Высокие риски (не всегда “взлом”, но вероятные баги/падения/потери данных)

### 4) `synchronize: true` включён всегда

**Файл:** `src/app.module.ts`

**Риск:**

- Для продакшена это опасно (непредсказуемые миграции схемы, потеря данных при изменениях).
- Нужна стратегия миграций и env-переключение (`synchronize` только для dev).

**План (принятое решение):**

- Уйти от `synchronize: true` и перейти на полноценные миграции, т.к. при изменениях схемы база периодически “ломается”, что приводит к потере данных и необходимости пересоздавать её вручную.

### 5) Bootstrapping поднимает приложение дважды (побочные эффекты + время старта)

**Файл:** `src/main.ts`

- Сначала `createApplicationContext(AppModule)` чтобы проверить `JWT_SECRET`, затем создаётся реальный HTTP app.

**Риск:**

- Двойная инициализация модулей/подключений к БД.
- Потенциальные побочные эффекты при старте (особенно при `synchronize: true`).

Решение уровня платформы: валидация env через `ConfigModule` с schema-validation (например, Joi/Zod) при одном старте.

### 6) Неполные транзакции при генерации тестов (частично записанные данные)

**Файл:** `src/modules/exams/services/exams.service.ts`

- Создание `Exam` → затем `Question` → затем `ExamResult` происходит последовательными `save`, без транзакции.

**Риск:** при ошибке в середине в БД остаются “обломки” (например, экзамен без результатов).

### 7) Связь экзамена с уроком через строковый title (ошибочный матч при одинаковых названиях)

**Файл:** `src/modules/exams/services/exams.service.ts`

- `updateLessonProgress()` ищет `Lesson` по `title`, полученному из `exam.title.replace('Тест по уроку: ', '')`.
- `findExamsByLesson()` ищет экзамены по `title: "Тест по уроку: ${lesson.title}"`.

**Риск:**

- Название урока не обязано быть уникальным → прогресс может обновляться не тому уроку.
- Ренейм урока ломает привязку к уже созданным экзаменам.

Правильнее: хранить `lessonId` на `Exam` (или отдельную связь `ManyToOne`).

## Средние/низкие проблемы качества (но их много, и они “разъедают” поддержку)

### 8) DTO/валидация местами неполная или неконсистентная

**Примеры:**

- `CreateModuleDto.courseId` — `string` без `@IsUUID()` (при этом `userId` обязателен и валидируется).
- `GenerateTestDto.mode`, `questionTypes` — без `@IsIn`, `@IsArray`, `@ArrayUnique`, `@ArrayNotEmpty`.
- `CreateQuestionDto.options?: Record<string, any>` — очень слабая типизация; фактически там иногда массив.

### 9) Некорректные/неинформативные исключения и статус-коды

**Примеры:**

- `throw new Error('Failed to generate test')` / `throw new Error('Failed to generate lesson content')`

**Риск:** клиент получает 500 без контекста, сложнее наблюдать и отлаживать; нет единого формата ошибок.

### 10) Микс логгеров

Есть `nestjs-pino`, но сервисы используют `new Logger(...)` из `@nestjs/common` и иногда `console.error` (в bootstrap это ок).

Рекомендация: унифицировать через `PinoLogger`/интерфейс логирования, чтобы формат был одинаковым.

### 11) Мёртвый/неиспользуемый код

**Примеры:**

- `src/shared/decorators/check-access.decorator.ts` и `src/shared/interceptors/access-control.interceptor.ts` есть, но не используются (по поиску `CheckAccess(`).
- В `src/shared/shared.module.ts` закомментирован seed (`UserSeedService`) — стоит либо удалить, либо восстановить.

### 12) Потенциальные проблемы с cookie-конфигурацией

**Файл:** `src/modules/auth/controllers/auth.controller.ts`

- `cookieOptions.maxAge` всегда ставится в 24 часа, но фактическое `JWT_EXPIRES_IN` может не совпадать.
- `logout` делает `clearCookie('access_token')` без тех же опций (`path`, `sameSite`, `secure`) — в некоторых условиях cookie может не очиститься.

### 13) CORS/Origin захардкожен

**Файл:** `src/main.ts`, `src/shared/guards/csrf.guard.ts`

- Есть hardcode `http://localhost:5173`, `http://localhost:3000`. Для деплоя нужно увести в env и синхронизировать с CSRF allowed origins.

## Приоритеты исправления (минимальный план)

### P0 (блокер безопасности)

- Защитить `ChatController` JWT-guard’ом и привязать `userId` только к токену.
- Убрать `userId` из body там, где его можно/нужно получать из `@CurrentUser()` (courses/exams/lessons/questions).
- Ввести нормальную авторизацию для `UsersController` (как минимум: пользователь может менять только себя, админ — всех).
- Закрыть утечки “все записи” (`/users`, `/courses/list`, вопросы/ответы) — фильтрация по владельцу/доступу + пагинация.

### P1 (корректность данных)

- Привязать `Exam` к `lessonId` (не через title) и переписать `findExamsByLesson/updateLessonProgress`.
- Обернуть генерацию теста (Exam+Questions+ExamResults) в транзакцию.

### P2 (платформенные улучшения)

- Сделать env-валидацию через `ConfigModule` + schema (один старт приложения).
- `synchronize` сделать env-зависимым и подготовить миграции.
- Унифицировать ошибки и логирование.

---

## Приложение: ключевые места для ревью

- Auth bootstrap: `src/main.ts`, `src/modules/auth/*`
- DB config: `src/app.module.ts`
- Access control: `src/shared/services/access-control.service.ts`
- Проблемные контроллеры: `src/modules/chat/controllers/chat.controller.ts`, `src/modules/users/controllers/users.controller.ts`, `src/modules/exams/controllers/exams.controller.ts`, `src/modules/courses/controllers/courses.controller.ts`, `src/modules/courses/controllers/lessons.controller.ts`
- Потенциально проблемная связка тестов/урока: `src/modules/exams/services/exams.service.ts`
