import { createStore, createEvent, createEffect, sample } from 'effector';
import { lessonsApi, type Lesson } from '../../api/lessons';

// Events
export const loadLesson = createEvent<string>();
export const resetLesson = createEvent();

// Effects
export const loadLessonFx = createEffect(
  async (lessonId: string): Promise<Lesson> => {
    return lessonsApi.getLessonById(lessonId);
  },
);

// Stores
export const $currentLesson = createStore<Lesson | null>(null)
  .on(loadLessonFx.doneData, (_, lesson) => lesson)
  .reset(resetLesson);

export const $lessonLoading = createStore(false).on(
  loadLessonFx.pending,
  (_, pending) => pending,
);

export const $lessonError = createStore<string | null>(null)
  .on(loadLessonFx.failData, (_, error) => error.message)
  .reset([loadLessonFx, resetLesson]);

export const $lessonNotFound = createStore(false)
  .on(loadLessonFx.failData, (_, error) => error.message === 'Lesson not found')
  .reset([loadLessonFx, resetLesson]);

// Connections
sample({
  clock: loadLesson,
  target: loadLessonFx,
});
