import { createBrowserRouter } from 'react-router';
import { HomePage } from '../../pages/home';
import { LoginPage } from '../../pages/login';
import { RegisterPage } from '../../pages/register';
import { ProfilePage } from '../../pages/profile';
import { Lesson } from '../../pages/lesson';
import { Lessons } from '../../pages/lessons';
import { Units } from '../../pages/units';
import { Unit } from '../../pages/unit';
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
      { path: 'courses', Component: () => <div>Courses</div> },
      { path: 'courses/:id', Component: () => <div>Course</div> },
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
