# Code Splitting

## Описание

Реализован code splitting для оптимизации размера бандла фронтенда. Страницы загружаются динамически при переходе по маршрутам, что уменьшает начальный размер бандла.

## Реализация

### Lazy Loading страниц

Все страницы в `frontend/src/app/config/router.tsx` загружаются через `React.lazy()`:

```12:18:frontend/src/app/config/router.tsx
const HomePage = lazy(() => import('@pages/home').then((m) => ({ default: m.HomePage })));
const LoginPage = lazy(() => import('@pages/login').then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('@pages/register').then((m) => ({ default: m.RegisterPage })));
const ProfilePage = lazy(() => import('@pages/profile').then((m) => ({ default: m.ProfilePage })));
const Lesson = lazy(() => import('@pages/lesson').then((m) => ({ default: m.Lesson })));
const Lessons = lazy(() => import('@pages/lessons').then((m) => ({ default: m.Lessons })));
const Units = lazy(() => import('@pages/units').then((m) => ({ default: m.Units })));
```

### Suspense в Layout

В `frontend/src/app/ui/Layout.tsx` добавлен `Suspense` для обработки загрузки lazy компонентов:

```60:62:frontend/src/app/ui/Layout.tsx
      <Suspense fallback={<AppLoader />}>
        <Outlet />
      </Suspense>
```

### Manual Chunks в Vite

В `frontend/vite.config.ts` настроено разделение vendor библиотек на отдельные чанки:

```24:40:frontend/vite.config.ts
    rollupOptions: {
      output: {
        manualChunks: {
          // Разделяем большие библиотеки на отдельные чанки
          'react-vendor': ['react', 'react-dom', 'react-router'],
          'mui-vendor': [
            '@mui/material',
            '@mui/icons-material',
            '@emotion/react',
            '@emotion/styled',
          ],
          'effector-vendor': ['effector', 'effector-react'],
          'markdown-vendor': ['react-markdown', 'react-syntax-highlighter', 'remark-gfm'],
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Увеличиваем лимит до 1MB для предупреждений
```

## Результат

- Страницы загружаются отдельными чанками по требованию
- Vendor библиотеки разделены на отдельные чанки (react-vendor, mui-vendor, effector-vendor, markdown-vendor)
- Уменьшен начальный размер бандла
- Улучшена производительность загрузки приложения

## Файлы

- `frontend/src/app/config/router.tsx` - конфигурация роутера с lazy loading
- `frontend/src/app/ui/Layout.tsx` - Layout с Suspense
- `frontend/vite.config.ts` - конфигурация сборки с manual chunks
