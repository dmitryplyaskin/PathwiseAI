# Обновление карточки урока (Lesson Card Refactoring)

Произведен рефакторинг компонента карточки урока для унификации отображения и поддержки различных режимов использования (список уроков и режим повторения).

## Основные изменения

1.  **Универсальный компонент `LessonCard`**
    *   Путь: `frontend/src/features/lesson-card/ui/LessonCard.tsx`
    *   Компонент обновлен для использования реальных данных из API (`Lesson` и `LessonForReview`).
    *   Добавлена поддержка пропса `variant` (`'default' | 'review'`).
    *   **Интерфейс:**
        *   Отображает название, статус, курс и раздел (breadcrumbs).
        *   Показывает метаданные: время чтения и сложность.
        *   В режиме повторения (`variant="review"`) отображает дату следующего повторения, интервал и приоритет.
        *   В обычном режиме (`variant="default"`) отображает дату создания и статус прохождения.

2.  **Обновление списков**
    *   **`LessonsList`** (`frontend/src/widgets/lessons-list/ui/LessonsList.tsx`):
        *   Переведен на использование нового `LessonCard` в режиме `default`.
        *   Убрана дублирующая логика форматирования дат и статусов.
    *   **`ReviewLessonsList`** (`frontend/src/widgets/review-lessons/ui/ReviewLessonsList.tsx`):
        *   Переведен на использование нового `LessonCard` в режиме `review`.
        *   Реализовано отображение приоритета повторения (Критично/Важно/Планово) внутри карточки.

3.  **Очистка кода**
    *   Удален неиспользуемый файл моков: `frontend/src/widgets/lessons-list/model/mock.ts`.

## Использование

Пример использования компонента:

```tsx
import { LessonCard } from '@features/lesson-card/ui/LessonCard';

// Обычный режим
<LessonCard 
  lesson={lessonData} 
  variant="default" 
  onClick={handleCardClick} 
/>

// Режим повторения
<LessonCard 
  lesson={lessonReviewData} 
  variant="review" 
  onClick={handleCardClick}
  onAction={handleRepeatClick} // Кнопка "Повторить"
/>
```

