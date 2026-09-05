import { createStore, createEvent, createEffect, sample } from 'effector';
import { coursesApi } from '../../api/courses';
import type {
  CourseListItem,
  CreateModuleRequest,
  CreateModuleResponse,
  CreateCourseOutlineRequest,
  CreateCourseOutlineResponse,
  CourseDetail,
  LessonDetail,
} from '../../api/courses/types';

// Events
export const loadCoursesList = createEvent();
export const createModule = createEvent<CreateModuleRequest>();
export const createCourseOutline = createEvent<CreateCourseOutlineRequest>();
export const loadCourseDetail = createEvent<string>();
export const loadLessonDetail = createEvent<string>();
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

export const createCourseOutlineFx = createEffect(
  async (
    data: CreateCourseOutlineRequest,
  ): Promise<CreateCourseOutlineResponse> => {
    return coursesApi.createCourseOutline(data);
  },
);

export const loadCourseDetailFx = createEffect(
  async (courseId: string): Promise<CourseDetail> => {
    return coursesApi.getCourseDetail(courseId);
  },
);

export const loadLessonDetailFx = createEffect(
  async (lessonId: string): Promise<LessonDetail> => {
    return coursesApi.getLessonDetail(lessonId);
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

export const $courseOutlineCreating = createStore(false).on(
  createCourseOutlineFx.pending,
  (_, pending) => pending,
);

export const $courseOutlineCreationError = createStore<string | null>(null)
  .on(createCourseOutlineFx.failData, (_, error) => error.message)
  .reset([createCourseOutlineFx, resetCreationState]);

export const $createdCourseOutline =
  createStore<CreateCourseOutlineResponse | null>(null)
    .on(createCourseOutlineFx.doneData, (_, outline) => outline)
    .reset(resetCreationState);

export const $courseDetail = createStore<CourseDetail | null>(null)
  .on(loadCourseDetailFx.doneData, (_, course) => course)
  .reset(loadCourseDetail);

export const $courseDetailLoading = createStore(false).on(
  loadCourseDetailFx.pending,
  (_, pending) => pending,
);

export const $courseDetailError = createStore<string | null>(null)
  .on(loadCourseDetailFx.failData, (_, error) => error.message)
  .reset(loadCourseDetailFx);

export const $lessonDetail = createStore<LessonDetail | null>(null)
  .on(loadLessonDetailFx.doneData, (_, lesson) => lesson)
  .reset(loadLessonDetail);

export const $lessonDetailLoading = createStore(false).on(
  loadLessonDetailFx.pending,
  (_, pending) => pending,
);

export const $lessonDetailError = createStore<string | null>(null)
  .on(loadLessonDetailFx.failData, (_, error) => error.message)
  .reset(loadLessonDetailFx);

// Connections
sample({
  clock: loadCoursesList,
  target: loadCoursesListFx,
});

sample({
  clock: createModule,
  target: createModuleFx,
});

sample({
  clock: createCourseOutline,
  target: createCourseOutlineFx,
});

sample({
  clock: loadCourseDetail,
  target: loadCourseDetailFx,
});

sample({
  clock: loadLessonDetail,
  target: loadLessonDetailFx,
});

// Автоматически загружаем список курсов при создании модуля или курса, если он пустой
sample({
  clock: [createModuleFx.done, createCourseOutlineFx.done],
  source: $coursesList,
  filter: (courses) => courses.length === 0,
  target: loadCoursesListFx,
});
