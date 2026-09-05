# Дубликаты запросов на фронтенде

## Обнаруженные дубликаты

### 1. Запросы к курсам ✅ ИСПРАВЛЕНО

**Было:**

- `/courses` - использовался в `web/src/widgets/courses-list/model/index.ts:7`
- `/courses/list` - использовался в `web/src/shared/api/courses/api.ts:10`

**Решение:** Унифицирован эндпоинт `/courses` для всех запросов к курсам:

- Удалена старая Effector модель `web/src/widgets/courses-list/model/index.ts`
- Обновлен API слой для использования единого эндпоинта `/courses`
- Обновлен компонент `CoursesList` для использования централизованной модели

**Измененные файлы:**

- `web/src/shared/api/courses/api.ts` - унифицирован эндпоинт
- `web/src/widgets/courses-list/ui/CoursesList.tsx` - обновлен для использования централизованной модели
- `web/src/shared/api/courses/types.ts` - расширен интерфейс `CourseListItem`
- `web/src/features/course-card/ui/CourseCard.tsx` - обновлен тип

### 2. Запросы к урокам

**Потенциальное дублирование:**

- `lessonsApi.getAllLessons()` вызывается в `web/src/pages/home/ui/HomePage.tsx:65`
- `lessonsApi.getLessonById()` используется в `web/src/shared/model/lessons/lessons-model.ts:11`

**Проблема:** Нет централизованного управления состоянием уроков. Каждый компонент самостоятельно загружает данные.

**Файлы:**

- `web/src/pages/home/ui/HomePage.tsx`
- `web/src/shared/model/lessons/lessons-model.ts`
- `web/src/shared/api/lessons/api.ts`

### 3. Запросы к профилю пользователя

**Дублирование:**

- `usersApi.getProfile()` используется в `web/src/shared/model/auth/auth-model.ts:49`

**Проблема:** Отсутствует централизованное кеширование профиля пользователя.

**Файлы:**

- `web/src/shared/model/auth/auth-model.ts`
- `web/src/shared/api/users/api.ts`

## Рекомендации по устранению

### 1. Унификация эндпоинтов курсов

- Определить единый эндпоинт для получения списка курсов
- Удалить дублирующийся запрос из Effector модели
- Использовать только API слой для всех запросов к курсам

### 2. Централизация управления уроками

- Создать единую Effector модель для уроков
- Использовать `useApi` хук для автоматического кеширования
- Убрать прямые вызовы API из компонентов

### 3. Кеширование профиля пользователя

- Добавить кеширование в `auth-model.ts`
- Использовать `useApi` хук для автоматического управления состоянием

## Файлы для рефакторинга

### Приоритет 1 (критично)

- `web/src/widgets/courses-list/model/index.ts`
- `web/src/shared/api/courses/api.ts`

### Приоритет 2 (важно)

- `web/src/pages/home/ui/HomePage.tsx`
- `web/src/shared/model/lessons/lessons-model.ts`

### Приоритет 3 (желательно)

- `web/src/shared/model/auth/auth-model.ts`
