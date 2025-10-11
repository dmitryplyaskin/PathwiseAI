# Рефакторинг модуля Courses

## Обзор изменений

Модуль `courses` был разделен на три отдельных сервиса для улучшения архитектуры и поддержки принципа единственной ответственности (Single Responsibility Principle).

## Структура до рефакторинга

До рефакторинга был один большой сервис `courses.service.ts` (411 строк), который отвечал за:

- Управление курсами (CRUD)
- Управление юнитами (CRUD)
- Управление уроками (CRUD)
- Генерацию контента уроков через AI
- Работу с AI-помощником (вопросы, треды, регенерация)

Промпты и JSON схемы были хранились в `prompts.json`.

## Структура после рефакторинга

### Новая структура папок

```
src/modules/courses/
├── config/
│   ├── lesson-generation.prompts.ts  # Промпты для генерации уроков
│   └── lesson-generation.schema.ts   # JSON схема для валидации ответов AI
├── services/
│   ├── courses.service.ts            # Сервис для работы с курсами
│   ├── units.service.ts              # Сервис для работы с юнитами
│   └── lessons.service.ts            # Сервис для работы с уроками и AI
├── controllers/
│   └── courses.controller.ts         # Обновленный контроллер
├── dto/
├── entities/
└── courses.module.ts                 # Обновленный модуль
```

### 1. CoursesService (`courses.service.ts`)

**Ответственность:** Управление курсами

**Методы:**

- `createCourse(createCourseDto)` - создание курса
- `findAllCourses()` - получение всех курсов
- `findCoursesForList()` - получение списка курсов (id + title)
- `findOneCourse(id)` - получение курса по ID
- `updateCourse(id, updateCourseDto)` - обновление курса
- `removeCourse(id)` - удаление курса

### 2. UnitsService (`units.service.ts`)

**Ответственность:** Управление юнитами (разделами курсов)

**Методы:**

- `createUnit(createUnitDto)` - создание юнита
- `findAllUnits()` - получение всех юнитов
- `findOneUnit(id)` - получение юнита по ID
- `findUnitByCourseId(courseId)` - поиск юнита по ID курса
- `updateUnit(id, updateUnitDto)` - обновление юнита
- `removeUnit(id)` - удаление юнита
- `createUnitForCourse(courseId, order)` - создание юнита для курса с порядковым номером

### 3. LessonsService (`lessons.service.ts`)

**Ответственность:** Управление уроками, генерация контента через AI, работа с AI-помощником

**Методы:**

- `createLesson(createLessonDto)` - создание урока
- `findAllLessons()` - получение всех уроков
- `findOneLesson(id)` - получение урока по ID
- `updateLesson(id, updateLessonDto)` - обновление урока
- `removeLesson(id)` - удаление урока
- `createModule(createModuleDto)` - создание модуля с автоматической генерацией контента
- `askLessonQuestion(askLessonQuestionDto)` - отправка вопроса AI-помощнику
- `deleteThread(lessonId, threadId)` - удаление треда
- `regenerateMessage(lessonId, messageId)` - регенерация сообщения
- `getThreads(lessonId)` - получение списка тредов
- `getThreadMessages(lessonId, threadId)` - получение сообщений треда

**Приватные методы:**

- `generateLessonContent()` - генерация контента урока через AI
- `saveDebugResponse()` - сохранение отладочных данных

### 4. Конфигурационные файлы

#### `lesson-generation.prompts.ts`

Содержит:

- `PromptsConfig` интерфейс
- `lessonGenerationPrompts` объект с:
  - `systemPrompt` - системный промпт для AI
  - `userPromptTemplate` - шаблон пользовательского промпта
  - `complexityLevels` - описания уровней сложности (simple, normal, professional)

#### `lesson-generation.schema.ts`

Содержит:

- `LessonGenerationResponse` интерфейс
- `lessonGenerationSchema` - JSON схема для structured output от OpenRouter API

### 5. Обновленный контроллер

`CoursesController` теперь использует три отдельных сервиса:

- `coursesService` - для эндпоинтов курсов
- `unitsService` - для эндпоинтов юнитов
- `lessonsService` - для эндпоинтов уроков и AI-функционала

### 6. Обновленный модуль

`CoursesModule` теперь регистрирует и экспортирует все три сервиса:

```typescript
providers: [CoursesService, UnitsService, LessonsService],
exports: [CoursesService, UnitsService, LessonsService],
```

## Преимущества рефакторинга

1. **Разделение ответственности**: Каждый сервис отвечает за свою область
2. **Улучшенная поддерживаемость**: Проще находить и изменять код
3. **Лучшая тестируемость**: Можно тестировать каждый сервис отдельно
4. **Типизация промптов**: TypeScript вместо JSON для промптов
5. **Переиспользуемость**: Сервисы можно использовать независимо друг от друга

## Совместимость

Все изменения **обратно совместимы**. API эндпоинты остались без изменений:

- `/courses/*` - работа с курсами
- `/courses/units/*` - работа с юнитами
- `/courses/lessons/*` - работа с уроками
- `/courses/modules` - создание модулей
- `/courses/lessons/:id/ask` - вопросы к AI
- И другие...

## Зависимости между сервисами

```
LessonsService
  ├── CoursesService (для создания курсов при создании модуля)
  ├── UnitsService (для создания/поиска юнитов)
  ├── OpenRouterService (для генерации контента)
  └── ChatService (для работы с AI-помощником)

UnitsService
  └── (нет зависимостей от других сервисов)

CoursesService
  └── (нет зависимостей от других сервисов)
```

## Что было удалено

- ❌ `courses.service.old.ts` - старый монолитный сервис
- ❌ `prompts.json` - JSON файл с промптами
- ❌ `courses.module.old.ts` - старая версия модуля
- ❌ `courses.controller.old.ts` - старая версия контроллера

## Дата рефакторинга

4 октября 2025 года
