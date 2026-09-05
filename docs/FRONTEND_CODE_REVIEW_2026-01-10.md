# Frontend code review (web/src) — 2026-01-10

Цель: оценить качество кода фронтенда в `web/src/`, выявить риски, потенциальные баги, проблемы доступности (a11y) и зоны для улучшения. Отдельно отметить “мертвые”/недоделанные фичи и заглушки.

Контекст (по коду/зависимостям):

- React 19 (`react`, `react-dom`)
- React Router 7 (`react-router`)
- Vite 7
- MUI 7 + Emotion (`@mui/*`, `@emotion/*`)
- Effector (`effector`, `effector-react`)
- Markdown рендеринг: `react-markdown`, `remark-*`, `rehype-katex`, `react-syntax-highlighter`
- Архитектура близкая к Feature-Sliced (`app/ pages/ widgets/ features/ shared/`)

## Итоговая оценка (мнение)

**4/10 для продакшена** (в текущем виде) и **7/10 для прототипа**.

Сильные стороны: понятная структура папок (FSD), единый `ApiClient` с CSRF, строгий TS-конфиг, lazy-loading страниц, Effector-модели для курсов/уроков/авторизации.

Ключевая проблема: в текущем виде фронтенд одновременно содержит **прототипные решения (моки/стабы, статические пароли, отключенная типизация)** и **места, где клиенту доверяется критическая логика (правильные ответы, userId)**. Это ухудшает безопасность, корректность и поддержку.

## Что сделано хорошо

- **Структура проекта**: `app/pages/widgets/features/shared` — в целом читаемо и масштабируемо.
- **Code splitting**: роуты грузятся через `lazy()` (`web/src/app/config/router.tsx`), есть ручные чанки в `vite.config.ts`.
- **API слой**: `ApiClient` централизует `baseUrl`, заголовки, CSRF, таймауты и единый формат ошибок (`web/src/shared/api/base/client.ts`).
- **State management**: Effector-модели в `web/src/shared/model/*` в целом предсказуемые (events/effects/stores).
- **UI**: MUI даёт базовую семантику/фокус-стили, много компонентов уже выглядят аккуратно и консистентно.

## Критические проблемы (высокая вероятность ущерба/ломает корректность продукта)

### 1) Утечки и небезопасные прототипные практики в auth

**Файлы:**

- `web/src/shared/model/auth/auth-model.ts`
- `web/src/pages/login/index.tsx`
- `web/src/pages/register/index.tsx`

**Проблемы:**

- В `auth-model.ts` есть `console.log()` с данными логина/регистрации (включая пароль).
- На страницах логина/регистрации используются **статические данные** (`password123`, автогенерация email), что похоже на прототип, но это сейчас часть “боевого” UI.

**Последствия:**

- Потенциальная утечка чувствительных данных в консоль браузера.
- Смешивание demo-логики и прод-логики → сложно понять реальные требования/ограничения.

### 2) “Честность” тестов сломана: правильные ответы находятся на клиенте

**Файлы:**

- `web/src/widgets/test/types/index.ts` — `TextQuestion.expectedAnswer?: string`, `QuizOption.isCorrect: boolean`
- `web/src/widgets/test/ui/TextQuestion.tsx` — отправка `expectedAnswer` в API
- `web/src/shared/api/tests/types.ts` — `CheckTextAnswerRequest.expectedAnswer`

**Проблемы:**

- Клиент получает/хранит `expectedAnswer` и `isCorrect` и/или отправляет их на сервер.

**Последствия:**

- Любой пользователь может подменять ответы и получать “правильные” результаты.
- Любая аналитика/SM2 прогресс становится недостоверной.

### 3) Дублирующие/зацикливающиеся проверки авторизации на старте

**Файлы:**

- `web/src/app/ui/App.tsx` — вызывает `checkAuthRequested()` на mount
- `web/src/app/providers/with-initialized.tsx` — вызывает `checkAuthFx()` при изменении `appInitialized`
- `web/src/shared/model/auth/auth-model.ts` — `$appInitialized` становится `true` на `checkAuthFx.done/fail`

**Проблема:**

- `InitializedProvider` имеет `useEffect(..., [appInitialized])`, что приводит к повторному вызову `checkAuthFx()` при смене флага инициализации (минимум двойной запрос на старте, а при “same value updates” возможен цикл).

**Последствия:**

- Лишняя нагрузка на API, нестабильная инициализация, трудные для диагностики баги “мигающей” авторизации.

**Исправлено (2026-01-10):**

- Убран дублирующий вызов `checkAuthRequested()` из `App.tsx`.
- `InitializedProvider` теперь вызывает `checkAuthRequested()` **один раз на mount** (`useEffect(..., [])`), без зависимости от `appInitialized`.

### 4) Жёстко заданный URL API

**Файл:** `web/src/shared/api/config.ts`

**Проблема:** `baseUrl: 'http://localhost:3000/api'` без env/окружений.

**Последствия:** невозможность нормально разводить dev/staging/prod без правки кода.

**Исправлено (2026-01-10):**

- `baseUrl` берётся из `import.meta.env.VITE_API_BASE_URL` (с fallback на `http://localhost:3000/api`).
- Добавлен пример переменной: `web/env.example` (копировать в `web/.env`).

### 5) Отключенная типизация в типах уроков

**Файл:** `web/src/shared/api/lessons/types.ts`

**Проблема:** `// @ts-nocheck` отключает типизацию целого модуля.

**Последствия:** ошибки формата данных и полей будут проявляться только в runtime.

## Высокие риски (скорее баги/нестабильность/поддержка, чем мгновенный “взлом”)

### 6) Смешение реального функционала и моков/заглушек в роутинге

**Файлы:**

- `web/src/widgets/units-list/ui/UnitsList.tsx` — всегда `mockUnits`
- `web/src/widgets/unit/ui/UnitPage.tsx` — всегда `mockUnitDetail`
- `web/src/pages/lessons/index.tsx` — возвращает пустой список (`lessons={[]}`)
- `web/src/widgets/lesson/ui/LessonPage.tsx` — `mockLessonContent` как fallback-контент
- `web/src/widgets/lesson/ui/LessonManagementMenu.tsx` — пункты меню “Поменять курс/Добавить/изменить юнит” только логируют действие

**Последствия:**

- Непонятно, какие страницы реально поддерживаются backend-ом.
- Пользовательский сценарий “курсы → модули → уроки” частично настоящий, частично demo.

### 7) Клиент шлёт `userId` в запросах (не должен быть источником истины)

**Файлы (примеры):**

- `web/src/shared/api/tests/types.ts` — большинство DTO содержит `userId`
- `web/src/shared/api/courses/types.ts` — `CreateModuleRequest.userId`, `CreateCourseOutlineRequest.userId`
- `web/src/shared/api/lessons/api.ts` — `getLessonsForReview(userId)` и т.п.

**Риск:**

- Если backend не “перепривязывает” userId к JWT, появляется возможность горизонтального доступа. Даже если backend защищён, на фронте это закрепляет неправильный контракт API.

### 8) Accessibility (a11y) проблемы: кликабельные карточки и кнопки без aria-label

**Файлы (примеры):**

- `web/src/pages/home/ui/HomePage.tsx` — `Card onClick` + `IconButton` без `aria-label`
- `web/src/features/course-card/ui/CourseCardWithLessons.tsx` — `Card onClick` вместо `CardActionArea`/`ButtonBase`
- `web/src/widgets/test/ui/TestModal.tsx` — `IconButton` закрытия без `aria-label`
- `web/src/pages/review/ui/ReviewPage.tsx` — `IconButton` back без `aria-label`
- `web/src/widgets/lesson/ui/thread_panel.tsx`, `thread_menu.tsx`, `question_input.tsx`, `markdown-renderer.tsx` — `IconButton` в Tooltip без явного `aria-label`

**Последствия:**

- Клавиатурная навигация и screen readers работают хуже (особенно для “карточка как кнопка”).

### 9) Типизация “обходит” строгий TS через `any`/`@ts-ignore`

**Файлы (примеры):**

- `web/src/shared/api/hooks/use-api.ts` — `T = any`, `(...args: any[])`, `onSuccess(data: any)`
- `web/src/shared/ui/Typography/Typography.tsx` — `variant as any`
- `web/src/shared/config/theme.ts` — `@ts-ignore` (в т.ч. из-за кастомных palette keys/теней)
- `web/src/shared/ui/markdown-renderer/markdown-renderer.tsx`, `web/src/widgets/test/ui/TextQuestion.tsx` — `@ts-ignore`

**Последствия:**

- Снижается ценность строгого `tsconfig` (`strict: true`), появляются “слепые зоны”.

### 10) Глобальные CSS/темизация потенциально бьют по производительности и a11y

**Файл:** `web/src/shared/config/theme.ts`

- `MuiCssBaseline.styleOverrides['*'] = { transition: 'all ...' }` — риск лишних перерисовок/дорогих анимаций.
- Нет учёта `prefers-reduced-motion`.

**Исправлено (2026-01-10):**

- Убран глобальный `transition` на `*` (перестал анимироваться layout/стили “везде”).
- Добавлен `@media (prefers-reduced-motion: reduce)` (отключение transitions/animations).
- Локальные `transition: all` заменены на точечные свойства в интерактивных элементах (карточки/hover-эффекты).

### 11) `index.html` не соответствует фактическому языку/брендингу приложения

**Файл:** `web/index.html`

- `lang="en"` при русскоязычном UI.
- Title: `Vite + React + TS`.

## Средние/низкие проблемы качества (накоплением ухудшают поддержку)

### 12) `ApiClient` предполагает JSON в любом ответе

**Файл:** `web/src/shared/api/base/client.ts`

- Всегда делается `response.json()` на успешном ответе; для 204/пустого тела это потенциальный runtime error (зависит от поведения backend).

### 13) Breadcrumbs делают дополнительные запросы и имеют “дырки” по юнитам

**Файл:** `web/src/shared/ui/breadcrumbs/use-breadcrumbs.ts`

- При навигации загружает названия сущностей, но:
  - для unit нет API → крошки могут показывать `Раздел <id>`;
  - нет отмены запросов при смене маршрута (потенциальные гонки);
  - кэш `Map` без стратегии очистки.

### 14) Консольное логирование в UI

**Файлы (примеры):**

- `web/src/widgets/test/ui/TestModal.tsx`
- `web/src/widgets/lesson/ui/LessonManagementMenu.tsx`
- `web/src/widgets/lesson/model/use_lesson_page.ts`, `lesson_api.ts`

Рекомендация: оставить только структурное логирование в dev (или убрать полностью).

### 15) Нет тестов/контрактов

В `web/` отсутствуют unit/integration тесты и контрактные проверки ответов API (runtime schema validation).

---

## Приоритеты исправления (минимальный план)

### P0 (блокеры корректности/безопасности)

- Убрать `console.log` с auth-данными, убрать/изолировать статические `password123`/рандомные email (или явно пометить как demo-mode).
- Убрать передачу `expectedAnswer`/`isCorrect` на клиент (правильные ответы не должны уходить в браузер).
- Починить инициализацию auth: выбрать один механизм (`checkAuthRequested` _или_ `InitializedProvider`) и убрать зависимость `useEffect` от `appInitialized`.
- Вынести `apiConfig.baseUrl` в env (`import.meta.env.*`).
- Убрать `@ts-nocheck` из `web/src/shared/api/lessons/types.ts`.

### P1 (качество UX/a11y + поддержка)

- Привести кликабельные `Card` к доступному паттерну (например, `CardActionArea`/`ButtonBase`, клавиатурные обработчики).
- Добавить `aria-label` для `IconButton` по всему приложению.
- Привести `index.html` к реальным значениям (`lang="ru"`, нормальный title).
- Свести `any/@ts-ignore` к минимуму: модульная типизация MUI (palette keys, shadows) вместо подавления ошибок.

### P2 (платформенные улучшения)

- Централизованная обработка 401/403 (auto-logout + redirect).
- Единый механизм уведомлений об ошибках (toast/snackbar), вместо разрозненных `console.error`/локальных `Alert`.
- Добавить базовые тесты (smoke для роутинга, модели Effector, ключевые виджеты урока/теста).

---

## Приложение: ключевые места для ревью

- Entry/Providers: `web/src/main.tsx`, `web/src/app/providers/*`, `web/src/app/ui/Layout.tsx`
- Router: `web/src/app/config/router.tsx`
- API client: `web/src/shared/api/base/client.ts`, `web/src/shared/api/config.ts`
- Auth model: `web/src/shared/model/auth/auth-model.ts`
- Lessons: `web/src/shared/api/lessons/*`, `web/src/shared/model/lessons/*`, `web/src/widgets/lesson/*`
- Tests: `web/src/shared/api/tests/*`, `web/src/widgets/test/*`
- Mocks/stubs: `web/src/widgets/*/model/mock.ts`, `web/src/pages/lessons/index.tsx`, `web/src/widgets/units-list/ui/UnitsList.tsx`, `web/src/widgets/unit/ui/UnitPage.tsx`
