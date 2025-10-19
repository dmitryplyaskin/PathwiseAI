import { createBrowserRouter } from 'react-router';
import { HomePage } from '@pages/home';
import { LoginPage } from '@pages/login';
import { RegisterPage } from '@pages/register';
import { ProfilePage } from '@pages/profile';
import { Lesson } from '@pages/lesson';
import { Lessons } from '@pages/lessons';
import { Units } from '@pages/units';
import { Unit } from '@pages/unit';
import { Courses } from '@pages/courses';
import { Course } from '@pages/course';
import { TestHistoryPage } from '@pages/test-history';
import { Layout } from '@app/ui/Layout';
import { AuthGuard } from '@shared/ui/auth-guard';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      {
        index: true,
        Component: () => (
          <AuthGuard requireAuth={true}>
            <HomePage />
          </AuthGuard>
        ),
      },
      {
        path: 'login',
        Component: () => (
          <AuthGuard requireAuth={false}>
            <LoginPage />
          </AuthGuard>
        ),
      },
      {
        path: 'register',
        Component: () => (
          <AuthGuard requireAuth={false}>
            <RegisterPage />
          </AuthGuard>
        ),
      },
      {
        path: 'profile',
        Component: () => (
          <AuthGuard requireAuth={true}>
            <ProfilePage />
          </AuthGuard>
        ),
      },
      {
        path: 'courses',
        Component: () => (
          <AuthGuard requireAuth={true}>
            <Courses />
          </AuthGuard>
        ),
      },
      {
        path: 'courses/:id',
        Component: () => (
          <AuthGuard requireAuth={true}>
            <Course />
          </AuthGuard>
        ),
      },
      {
        path: 'courses/:id/units',
        Component: () => (
          <AuthGuard requireAuth={true}>
            <Units />
          </AuthGuard>
        ),
      },
      {
        path: 'courses/:id/units/:unitId',
        Component: () => (
          <AuthGuard requireAuth={true}>
            <Unit />
          </AuthGuard>
        ),
      },
      {
        path: 'courses/:id/units/:unitId/lessons',
        Component: () => (
          <AuthGuard requireAuth={true}>
            <Lessons />
          </AuthGuard>
        ),
      },
      {
        path: 'courses/:id/units/:unitId/lessons/:lessonId',
        Component: () => (
          <AuthGuard requireAuth={true}>
            <Lesson />
          </AuthGuard>
        ),
      },
      {
        path: 'courses/:id/lessons/:lessonId',
        Component: () => (
          <AuthGuard requireAuth={true}>
            <Lesson />
          </AuthGuard>
        ),
      },
      {
        path: 'test-history',
        Component: () => (
          <AuthGuard requireAuth={true}>
            <TestHistoryPage />
          </AuthGuard>
        ),
      },
    ],
  },
]);
