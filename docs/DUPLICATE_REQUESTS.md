# Дубликаты запросов на фронтенде

## Обнаруженные дубликаты

### 1. Запросы к курсам ✅ ИСПРАВЛЕНО

**Было:**

- `/courses` - использовался в `frontend/src/widgets/courses-list/model/index.ts:7`
- `/courses/list` - использовался в `frontend/src/shared/api/courses/api.ts:10`

**Решение:** Унифицирован эндпоинт `/courses` для всех запросов к курсам:

- Удалена старая Effector модель `frontend/src/widgets/courses-list/model/index.ts`
- Обновлен API слой для использования единого эндпоинта `/courses`
- Обновлен компонент `CoursesList` для использования централизованной модели

**Измененные файлы:**

- `frontend/src/shared/api/courses/api.ts` - унифицирован эндпоинт
- `frontend/src/widgets/courses-list/ui/CoursesList.tsx` - обновлен для использования централизованной модели
- `frontend/src/shared/api/courses/types.ts` - расширен интерфейс `CourseListItem`
- `frontend/src/features/course-card/ui/CourseCard.tsx` - обновлен тип

### 2. Запросы к урокам

**Потенциальное дублирование:**

- `lessonsApi.getAllLessons()` вызывается в `frontend/src/pages/home/ui/HomePage.tsx:65`
- `lessonsApi.getLessonById()` используется в `frontend/src/shared/model/lessons/lessons-model.ts:11`

**Проблема:** Нет централизованного управления состоянием уроков. Каждый компонент самостоятельно загружает данные.

**Файлы:**

- `frontend/src/pages/home/ui/HomePage.tsx`
- `frontend/src/shared/model/lessons/lessons-model.ts`
- `frontend/src/shared/api/lessons/api.ts`

### 3. Запросы к профилю пользователя

**Дублирование:**

- `usersApi.getProfile()` используется в `frontend/src/shared/model/auth/auth-model.ts:49`

**Проблема:** Отсутствует централизованное кеширование профиля пользователя.

**Файлы:**

- `frontend/src/shared/model/auth/auth-model.ts`
- `frontend/src/shared/api/users/api.ts`

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

- `frontend/src/widgets/courses-list/model/index.ts`
- `frontend/src/shared/api/courses/api.ts`

### Приоритет 2 (важно)

- `frontend/src/pages/home/ui/HomePage.tsx`
- `frontend/src/shared/model/lessons/lessons-model.ts`

### Приоритет 3 (желательно)

- `frontend/src/shared/model/auth/auth-model.ts`
