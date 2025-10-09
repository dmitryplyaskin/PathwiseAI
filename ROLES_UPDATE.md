# Обновление системы авторизации: роли и авторизация по логину

## Что было добавлено

### 1. Система ролей

- Создан enum `UserRole` с ролями `USER` и `ADMIN`
- Добавлено поле `role` в сущность `User` с значением по умолчанию `USER`
- Обновлены DTO для поддержки ролей

### 2. Авторизация по логину

- Изменен `LoginDto` для использования поля `login` вместо `email`
- Обновлена локальная стратегия для работы с логином
- Добавлен метод `findByLoginForAuth` в `UsersService` для поиска по email или username

### 3. Guards и декораторы для ролей

- Создан декоратор `@Roles()` для указания требуемых ролей
- Создан `RolesGuard` для проверки ролей пользователя
- Обновлен `JwtStrategy` для включения роли в payload

### 4. Админские эндпоинты

- Создан `AdminController` с демонстрационными эндпоинтами:
  - `/admin/dashboard` - только для админов
  - `/admin/info` - для всех авторизованных пользователей

## Новые файлы

```
src/modules/users/enums/user-role.enum.ts
src/modules/auth/decorators/roles.decorator.ts
src/modules/auth/guards/roles.guard.ts
src/modules/auth/controllers/admin.controller.ts
```

## Обновленные файлы

- `src/modules/users/entities/user.entity.ts` - добавлено поле role
- `src/modules/auth/dto/login.dto.ts` - изменено поле email на login
- `src/modules/auth/dto/register.dto.ts` - добавлена поддержка ролей
- `src/modules/users/dto/create-user.dto.ts` - добавлена поддержка ролей
- `src/modules/auth/strategies/local.strategy.ts` - обновлен для работы с логином
- `src/modules/auth/services/auth.service.ts` - добавлена поддержка ролей
- `src/modules/users/services/users.service.ts` - добавлен метод findByLoginForAuth
- `src/modules/auth/strategies/jwt.strategy.ts` - добавлена поддержка ролей

## API изменения

### Авторизация

```http
POST /auth/login
{
  "login": "email_or_username",  // Было: "email"
  "password": "password123"
}
```

### Регистрация с ролью

```http
POST /auth/register
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123",
  "role": "admin"  // Новое поле, опциональное
}
```

### Новые эндпоинты

```http
GET /admin/dashboard    # Только для админов
GET /admin/info        # Для всех авторизованных
```

## Использование ролей

### В контроллерах

```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Get('admin-only')
getAdminData() {
  return { message: 'Только для админов' };
}
```

### В сервисах

```typescript
if (user.role === UserRole.ADMIN) {
  // Логика для админа
}
```

## Тестирование

Система поддерживает:

- Авторизацию по email: `{"login": "user@example.com", "password": "123"}`
- Авторизацию по username: `{"login": "username", "password": "123"}`
- Проверку ролей на эндпоинтах
- Создание пользователей с разными ролями

## Безопасность

- Роли проверяются на уровне guards
- JWT токены содержат информацию о роли пользователя
- По умолчанию все новые пользователи получают роль `USER`
- Админские эндпоинты защищены от доступа обычных пользователей
