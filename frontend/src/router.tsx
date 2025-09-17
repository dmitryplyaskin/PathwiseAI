import { createBrowserRouter } from 'react-router';
import App from './App';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
  },
  { path: '/login', Component: () => <div>Login</div> },
  { path: '/register', Component: () => <div>Register</div> },
  { path: '/profile', Component: () => <div>Profile</div> },
  { path: '/courses', Component: () => <div>Courses</div> },
  { path: '/courses/:id', Component: () => <div>Course</div> },
  { path: '/courses/:id/units', Component: () => <div>Units</div> },
  { path: '/courses/:id/units/:unitId', Component: () => <div>Unit</div> },
  {
    path: '/courses/:id/units/:unitId/lessons',
    Component: () => <div>Lessons</div>,
  },
  {
    path: '/courses/:id/units/:unitId/lessons/:lessonId',
    Component: () => <div>Lesson</div>,
  },
]);
