import { useEffect } from 'react';
import { useUnit } from 'effector-react';
import {
  $currentLesson,
  $lessonLoading,
  $lessonError,
  $lessonNotFound,
  loadLesson,
  resetLesson,
} from './lessons-model';

/**
 * Хук для получения урока по ID.
 * Автоматически загружает урок при монтировании и сбрасывает при размонтировании.
 *
 * @param lessonId - ID урока для загрузки
 * @returns Объект с данными урока, статусом загрузки и ошибкой
 */
export const useLesson = (lessonId: string | undefined) => {
  const { lesson, loading, error, notFound } = useUnit({
    lesson: $currentLesson,
    loading: $lessonLoading,
    error: $lessonError,
    notFound: $lessonNotFound,
  });

  useEffect(() => {
    if (lessonId) {
      loadLesson(lessonId);
    }

    return () => {
      resetLesson();
    };
  }, [lessonId]);

  return {
    lesson,
    loading,
    error,
    notFound,
  };
};
