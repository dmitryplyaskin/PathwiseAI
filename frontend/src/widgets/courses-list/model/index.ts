import { createEffect, createEvent, createStore } from 'effector';

export const $courses = createStore([]);
export const getCourses = createEvent();
export const getCoursesFx = createEffect(async () => {
  const response = await fetch('http://localhost:3000/api/courses', {
    credentials: 'include',
  });
  return response.json();
});
