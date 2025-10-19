# Страница курса

## Описание

Страница курса отображает детальную информацию о курсе с реальными данными из базы данных, включая список уроков и прогресс обучения.

## Функциональность

### Основные возможности

- Отображение информации о курсе (название, описание, прогресс)
- Список модулей и уроков с их статусами
- Навигация к урокам
- Отображение прогресса обучения
- Кнопка "Продолжить обучение" для следующего урока

### Вкладки

- **Обзор**: Описание курса и статистика
- **Программа**: Список всех уроков по модулям

## Архитектура

### Бэкенд

- **API Endpoint**: `GET /courses/:id` - получение курса с уроками
- **Сервис**: `CoursesService.findCourseWithLessons()` - загрузка курса с связанными данными
- **Связи**: Course → Units → Lessons с правильной сортировкой

### Фронтенд

- **Компонент**: `CoursePage` - основная страница курса
- **Состояние**: Effector stores для управления данными курса
- **API**: `coursesApi.getCourseDetail()` - получение данных курса

## Структура данных

### CourseDetail

```typescript
interface CourseDetail {
  id: string;
  title: string;
  description: string;
  progress: number;
  status: 'completed' | 'in_progress' | 'not_started';
  units: Array<{
    id: string;
    title: string;
    order: number;
    lessons: Array<{
      id: string;
      title: string;
      description: string;
      status: 'not_started' | 'learning' | 'mastered';
      reading_time: number;
      order: number;
    }>;
  }>;
}
```

## Файлы

### Бэкенд

- `src/modules/courses/services/courses.service.ts` - метод findCourseWithLessons
- `src/modules/courses/controllers/courses.controller.ts` - API endpoint

### Фронтенд

- `frontend/src/widgets/course/ui/CoursePage.tsx` - основной компонент
- `frontend/src/shared/api/courses/api.ts` - API методы
- `frontend/src/shared/api/courses/types.ts` - типы данных
- `frontend/src/shared/model/courses/courses-model.ts` - модель состояния

## Навигация

- Переход к уроку: `/courses/:courseId/lessons/:lessonId`
- Возврат к списку курсов: `/courses`
- Переход к модулям: `/courses/:courseId/units`

## Особенности

- Автоматическая загрузка данных при открытии страницы
- Отображение статусов уроков (не начат, изучается, освоен)
- Подсчет прогресса на основе завершенных уроков
- Адаптивный дизайн для мобильных устройств
