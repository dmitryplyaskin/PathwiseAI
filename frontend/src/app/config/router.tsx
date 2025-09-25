import { createBrowserRouter } from 'react-router';
import { HomePage } from '../../pages/home';
import { LoginPage } from '../../pages/login';
import { RegisterPage } from '../../pages/register';
import { ProfilePage } from '../../pages/profile';
import { Lesson } from '../../pages/lesson';
import { Lessons } from '../../pages/lessons';
import { Units } from '../../pages/units';
import { Unit } from '../../pages/unit';
import { Courses } from '../../pages/courses';
import { Course } from '../../pages/course';
import { Layout } from '../ui/Layout';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      {
        index: true,
        Component: HomePage,
      },
      { path: 'login', Component: LoginPage },
      { path: 'register', Component: RegisterPage },
      { path: 'profile', Component: ProfilePage },
      { path: 'courses', Component: Courses },
      { path: 'courses/:id', Component: Course },
      { path: 'courses/:id/units', Component: Units },
      { path: 'courses/:id/units/:unitId', Component: Unit },
      {
        path: 'courses/:id/units/:unitId/lessons',
        Component: Lessons,
      },
      {
        path: 'courses/:id/units/:unitId/lessons/:lessonId',
        Component: Lesson,
      },
    ],
  },
]);
