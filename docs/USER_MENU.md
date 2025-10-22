# UserMenu Компонент

## Описание

Компонент `UserMenu` предоставляет выпадающее меню пользователя в header приложения.

## Расположение

- Компонент: `frontend/src/widgets/user-menu/ui/UserMenu.tsx`
- Экспорт: `frontend/src/widgets/user-menu/index.ts`
- Использование: `frontend/src/app/ui/Layout.tsx`

## Функциональность

Компонент отображает:

- Аватар с первой буквой имени пользователя
- Имя пользователя
- Чип с ролью (Админ/Пользователь)

При клике открывается dropdown меню с тремя пунктами:

1. **История тестов** (`/test-history`) - переходит на страницу истории тестов
2. **Повторение** (`/review`) - переходит на страницу повторения
3. **Выйти** - выполняет выход из системы

## Зависимости

### Effector

- `$currentUser` - состояние текущего пользователя
- `logoutRequested` - событие выхода из системы

### UI Components

- Material-UI: `Button`, `Menu`, `MenuItem`, `ListItemIcon`, `ListItemText`, `Avatar`, `Chip`
- Material-UI Icons: `Quiz`, `AccessTime`, `Logout`

## Интеграция в Layout

Компонент заменяет предыдущие отдельные кнопки в header:

- Кнопка "Привет, {username}!"
- Чип с ролью
- Кнопка "История тестов"
- Кнопка "Повторение"
- Кнопка "Выйти"
