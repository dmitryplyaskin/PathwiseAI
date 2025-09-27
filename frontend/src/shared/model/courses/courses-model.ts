import { createStore, createEvent, createEffect, sample } from 'effector';
import { coursesApi } from '../../api/courses';
import type {
  CourseListItem,
  CreateModuleRequest,
  CreateModuleResponse,
} from '../../api/courses/types';

// Events
export const loadCoursesList = createEvent();
export const createModule = createEvent<CreateModuleRequest>();
export const resetCreationState = createEvent();

// Effects
export const loadCoursesListFx = createEffect(
  async (): Promise<CourseListItem[]> => {
    return coursesApi.getCoursesList();
  },
);

export const createModuleFx = createEffect(
  async (data: CreateModuleRequest): Promise<CreateModuleResponse> => {
    return coursesApi.createModule(data);
  },
);

// Stores
export const $coursesList = createStore<CourseListItem[]>([]).on(
  loadCoursesListFx.doneData,
  (_, courses) => courses,
);

export const $coursesListLoading = createStore(false).on(
  loadCoursesListFx.pending,
  (_, pending) => pending,
);

export const $coursesListError = createStore<string | null>(null)
  .on(loadCoursesListFx.failData, (_, error) => error.message)
  .reset(loadCoursesListFx);

export const $moduleCreating = createStore(false).on(
  createModuleFx.pending,
  (_, pending) => pending,
);

export const $moduleCreationError = createStore<string | null>(null)
  .on(createModuleFx.failData, (_, error) => error.message)
  .reset([createModuleFx, resetCreationState]);

export const $createdModule = createStore<CreateModuleResponse | null>(null)
  .on(createModuleFx.doneData, (_, module) => module)
  .reset(resetCreationState);

// Connections
sample({
  clock: loadCoursesList,
  target: loadCoursesListFx,
});

sample({
  clock: createModule,
  target: createModuleFx,
});

// Автоматически загружаем список курсов при создании модуля, если он пустой
sample({
  clock: createModuleFx.done,
  source: $coursesList,
  filter: (courses) => courses.length === 0,
  target: loadCoursesListFx,
});
