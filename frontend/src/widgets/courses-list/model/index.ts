import { createEffect, createEvent, createStore } from 'effector';
import { apiClient } from '../../../shared/api/config';

export const $courses = createStore([]);
export const getCourses = createEvent();
export const getCoursesFx = createEffect(async () => {
  return apiClient.get('/courses');
});
