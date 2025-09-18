import { createBrowserRouter } from 'react-router';
import App from './App';
import { LoginPage } from './pages/login';
import { RegisterPage } from './pages/register';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
  },
  { path: '/login', Component: LoginPage },
  { path: '/register', Component: RegisterPage },
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
