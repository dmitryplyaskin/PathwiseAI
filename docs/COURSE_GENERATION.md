# Генерация курсов

## Описание

Система генерации курсов позволяет создавать структурированные курсы с уроками-заглушками. Контент уроков генерируется по требованию при первом открытии.

## Архитектура

### Бэкенд

#### Сущности

- **Lesson**: Добавлен флаг `isCreated` для отслеживания готовности контента
- **Course**: Основная сущность курса
- **Unit**: Группировка уроков в курсе

#### Сервисы

- **LessonsService.createCourseOutline()**: Создание структуры курса с уроками-заглушками
- **LessonsService.findOneLesson()**: Автоматическая генерация контента при первом обращении

#### API Endpoints

- `POST /courses/outlines` - Создание структуры курса

#### Конфигурация

- `course-generation.schema.ts` - JSON схема для AI генерации
- `course-generation.prompts.ts` - Промпты для генерации курсов

### Фронтенд

#### Компоненты

- **ContentCreationModal**: Поддержка создания курсов через вкладку "Курс"
- **CourseForm**: Форма для создания курса

#### Модель состояния

- `createCourseOutline` - событие создания курса
- `$courseOutlineCreating` - состояние загрузки
- `$createdCourseOutline` - результат создания

## Процесс работы

1. **Создание курса**: Пользователь заполняет форму (тема, описание, сложность)
2. **Генерация структуры**: AI создает план курса с уроками
3. **Создание заглушек**: В БД создаются уроки с `isCreated: false`
4. **Генерация контента**: При открытии урока генерируется полный контент

## Файлы

### Бэкенд

- `src/modules/courses/entities/lesson.entity.ts` - Флаг isCreated
- `src/modules/courses/dto/create-course-outline.dto.ts` - DTO для создания курса
- `src/modules/courses/config/course-generation.schema.ts` - Схема генерации
- `src/modules/courses/config/course-generation.prompts.ts` - Промпты
- `src/modules/courses/services/lessons.service.ts` - Логика генерации
- `src/modules/courses/controllers/courses.controller.ts` - API endpoint

### Фронтенд

- `frontend/src/shared/api/courses/types.ts` - Типы для API
- `frontend/src/shared/api/courses/api.ts` - API методы
- `frontend/src/shared/model/courses/courses-model.ts` - Модель состояния
- `frontend/src/features/education-module/ui/content-creation/ContentCreationModal.tsx` - UI
