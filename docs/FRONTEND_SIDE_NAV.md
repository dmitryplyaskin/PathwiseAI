# Frontend: боковое меню (SideNav)

## Что сделано

Обновлён `SideNav` в стиле SaaS-навигации с фокусом на UX и доступность:

- новая IA с группировкой по учебному потоку
- улучшенные состояния `active`, `hover`, `focus-visible`
- desktop mini-режим с tooltip в свёрнутом состоянии
- сохранение desktop-состояния `collapsed/expanded` через `localStorage`
- mobile-режим оставлен как `temporary overlay drawer`

## IA навигации

Верхние секции:

- `Обзор`: `/`
- `Учёба`: `/courses`, `/review`
- `Прогресс`: `/test-history`

Нижний блок:

- `Аккаунт`: `/profile`, выход (`logoutRequested`)

## Где реализовано

- `frontend/src/app/ui/Layout.tsx`
  - хранит mobile-состояние `isNavOpen`
  - читает desktop-состояние `isNavCollapsed` из `localStorage` (lazy `useState`)
  - записывает desktop-состояние в `localStorage` при изменении
  - синхронизирует ширину контента с `DRAWER_WIDTH`/`DRAWER_COLLAPSED_WIDTH`
  - отображает мобильную кнопку открытия меню

- `frontend/src/widgets/side-nav/ui/SideNav.tsx`
  - `Drawer` в режимах `permanent` (desktop) и `temporary` (mobile)
  - секционная структура меню (`NavSection`)
  - бренд-блок `PathwiseAI` + подзаголовок
  - кнопка collapse/expand на desktop
  - профиль и выход в нижней части

## Персист состояния

- ключ: `pathwise.sidebar.collapsed.v1`
- формат значения: `'1'` (collapsed), `'0'` (expanded)
- запись выполняется только на desktop (`md+`)
- чтение/запись обёрнуты в `try/catch` на случай недоступности `localStorage`

## Поведение по устройствам

- Desktop (`md+`):
  - меню всегда отображается (`permanent`)
  - доступно сворачивание/разворачивание
  - состояние сохраняется между перезагрузками

- Mobile (`<md`):
  - меню открывается по плавающей кнопке (`temporary`)
  - закрывается по выбору пункта, `Esc` или backdrop
  - состояние `open/close` не персистится

## Как добавить новый пункт

1. Добавьте новый `NavItem` в нужную секцию `NAV_SECTIONS` в `frontend/src/widgets/side-nav/ui/SideNav.tsx`.
2. Для подсветки активного маршрута задайте `match`:
- `exact` для точного совпадения пути
- `prefix` для маршрутов с вложенными страницами
