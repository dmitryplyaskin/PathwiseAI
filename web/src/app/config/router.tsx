import { lazy } from 'react';
import { createBrowserRouter } from 'react-router';
import { Layout } from '@app/ui/Layout';
import { AuthGuard } from '@shared/ui/auth-guard';

// Lazy loading страниц для code splitting
const HomePage = lazy(() =>
  import('@pages/home').then((m) => ({ default: m.HomePage })),
);
const LoginPage = lazy(() =>
  import('@pages/login').then((m) => ({ default: m.LoginPage })),
);
const RegisterPage = lazy(() =>
  import('@pages/register').then((m) => ({ default: m.RegisterPage })),
);
const ProfilePage = lazy(() =>
  import('@pages/profile').then((m) => ({ default: m.ProfilePage })),
);
const Lesson = lazy(() =>
  import('@pages/lesson').then((m) => ({ default: m.Lesson })),
);
const Lessons = lazy(() =>
  import('@pages/lessons').then((m) => ({ default: m.Lessons })),
);
const Units = lazy(() =>
  import('@pages/units').then((m) => ({ default: m.Units })),
);
const Unit = lazy(() =>
  import('@pages/unit').then((m) => ({ default: m.Unit })),
);
const Courses = lazy(() =>
  import('@pages/courses').then((m) => ({ default: m.Courses })),
);
const Course = lazy(() =>
  import('@pages/course').then((m) => ({ default: m.Course })),
);
const TestHistoryPage = lazy(() =>
  import('@pages/test-history').then((m) => ({ default: m.TestHistoryPage })),
);
const ReviewPage = lazy(() =>
  import('@pages/review').then((m) => ({ default: m.ReviewPage })),
);

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
      {
        path: 'review',
        Component: () => (
          <AuthGuard requireAuth={true}>
            <ReviewPage />
          </AuthGuard>
        ),
      },
    ],
  },
]);
