# Настройка авторизации в PathwiseAI

## Обзор

В проекте реализована система авторизации с использованием Passport.js и JWT токенов. Система включает:

- Регистрацию пользователей
- Авторизацию по email или username
- Систему ролей (Admin, User)
- JWT токены для аутентификации
- Защищенные эндпоинты
- Проверку ролей для доступа к эндпоинтам
- Настраиваемое время жизни токена

## Установленные пакеты

```bash
# Основные пакеты
@nestjs/jwt          # JWT модуль для NestJS
passport-jwt         # JWT стратегия для Passport
@types/passport-jwt  # Типы для passport-jwt

# Уже были установлены ранее
@nestjs/passport     # Passport модуль для NestJS
passport             # Основной Passport пакет
passport-local       # Локальная стратегия для Passport
bcrypt               # Хеширование паролей
@types/bcrypt        # Типы для bcrypt
```

## Структура модуля авторизации

```
src/modules/auth/
├── controllers/
│   ├── auth.controller.ts      # Эндпоинты регистрации и авторизации
│   └── profile.controller.ts   # Защищенный эндпоинт профиля
├── services/
│   └── auth.service.ts         # Логика авторизации
├── strategies/
│   ├── jwt.strategy.ts         # JWT стратегия
│   └── local.strategy.ts       # Локальная стратегия
├── guards/
│   ├── jwt-auth.guard.ts       # JWT guard
│   └── local-auth.guard.ts     # Локальный guard
├── decorators/
│   └── current-user.decorator.ts # Декоратор для получения текущего пользователя
├── dto/
│   ├── login.dto.ts            # DTO для авторизации
│   └── register.dto.ts         # DTO для регистрации
├── auth.module.ts              # Модуль авторизации
└── README.md                   # Документация модуля
```

## API Эндпоинты

### Регистрация

```http
POST /auth/register
Content-Type: application/json

{
  "username": "newuser",
  "email": "user@example.com",
  "password": "password123",
  "settings": {}
}
```

**Ответ:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "username": "newuser",
    "email": "test@example.com",
    "settings": {},
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### Авторизация

```http
POST /auth/login
Content-Type: application/json

{
  "login": "test@example.com",  // Может быть email или username
  "password": "password123"
}
```

**Ответ:** (аналогичен регистрации)

### Админские эндпоинты

#### Админ панель (только для админов)

```http
GET /admin/dashboard
Authorization: Bearer <jwt_token>
```

**Ответ:**

```json
{
  "message": "Добро пожаловать в админ панель!",
  "user": {
    "id": "uuid",
    "username": "admin",
    "email": "admin@example.com",
    "role": "admin"
  },
  "adminFeatures": [
    "Управление пользователями",
    "Просмотр статистики",
    "Настройки системы"
  ]
}
```

#### Информация для всех авторизованных пользователей

```http
GET /admin/info
Authorization: Bearer <jwt_token>
```

### Получение профиля

```http
GET /profile
Authorization: Bearer <jwt_token>
```

**Ответ:**

```json
{
  "id": "uuid",
  "username": "newuser",
  "email": "test@example.com",
  "settings": {},
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

## Переменные окружения

Добавьте в ваш `.env` файл:

```env
# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here_change_in_production
# Время жизни токена (например: 24h, 7d, 30m, never для бесконечного времени жизни)
JWT_EXPIRES_IN=24h
```

### Варианты времени жизни токена:

- `24h` - 24 часа
- `7d` - 7 дней
- `30m` - 30 минут
- `never` - токен не истекает (бесконечное время жизни)
- Не указано - токен не истекает

## Использование в других контроллерах

### Защита отдельного эндпоинта

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('example')
export class ExampleController {
  @UseGuards(JwtAuthGuard)
  @Get('protected')
  getProtectedData(@CurrentUser() user: any) {
    return {
      message: `Hello ${user.username}`,
      userId: user.id,
    };
  }
}
```

### Глобальная защита модуля

```typescript
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class ProtectedModule {}
```

### Защита эндпоинтов по ролям

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('example')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExampleController {
  @Roles(UserRole.ADMIN)
  @Get('admin-only')
  getAdminOnlyData(@CurrentUser() user: any) {
    return {
      message: `Только для админов, ${user.username}`,
      role: user.role,
    };
  }

  @Roles(UserRole.ADMIN, UserRole.USER)
  @Get('both-roles')
  getBothRolesData(@CurrentUser() user: any) {
    return {
      message: `Доступно для админов и пользователей`,
      user: user.username,
      role: user.role,
    };
  }
}
```

### Исключение эндпоинтов из защиты

```typescript
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

// В контроллере
@Public()
@Get('public')
getPublicData() {
  return { message: 'This is public data' };
}
```

## Безопасность

1. **Хеширование паролей**: Используется bcrypt с автоматической генерацией соли
2. **JWT токены**: Подписываются секретным ключом
3. **Валидация**: Все входные данные валидируются с помощью class-validator
4. **Защита от дублирования**: Проверка уникальности email и username
5. **Настраиваемое время жизни**: Возможность установить время жизни токена или сделать его бесконечным

## Тестирование

Для тестирования авторизации используйте следующие команды:

```bash
# Запуск сервера
npm run start:dev

# Тестирование регистрации
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"newuser","email":"user@example.com","password":"password123"}'

# Тестирование авторизации по email
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"login":"test@example.com","password":"password123"}'

# Тестирование авторизации по username
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"login":"newuser","password":"password123"}'

# Тестирование защищенного эндпоинта
curl -X GET http://localhost:3000/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Тестирование админского эндпоинта
curl -X GET http://localhost:3000/admin/dashboard \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"

# Тестирование эндпоинта для всех ролей
curl -X GET http://localhost:3000/admin/info \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Интеграция с фронтендом

Для интеграции с фронтендом:

1. Сохраняйте JWT токен в localStorage или cookies
2. Добавляйте токен в заголовок `Authorization: Bearer <token>` для всех запросов
3. Обрабатывайте ошибки 401 (Unauthorized) для перенаправления на страницу входа
4. Обновляйте токен при необходимости

## Система ролей

### Доступные роли

- `USER` - Обычный пользователь (по умолчанию)
- `ADMIN` - Администратор системы

### Использование ролей

```typescript
// Регистрация пользователя с ролью админа
const adminUser = {
  username: 'admin',
  email: 'admin@example.com',
  password: 'password123',
  role: UserRole.ADMIN,
};

// Регистрация обычного пользователя (роль по умолчанию)
const regularUser = {
  username: 'user',
  email: 'user@example.com',
  password: 'password123',
  // роль не указана, будет USER по умолчанию
};
```

### Проверка ролей в коде

```typescript
// В контроллере
@Roles(UserRole.ADMIN)
@Get('admin-only')
getAdminData() {
  return { message: 'Только для админов' };
}

// В сервисе
if (user.role === UserRole.ADMIN) {
  // Логика для админа
}
```

## Дополнительные возможности

- Возможность добавления refresh токенов
- Интеграция с социальными сетями (Google, Facebook, etc.)
- Двухфакторная аутентификация
- Расширение системы ролей
- Аудит действий пользователей
- Группы пользователей и разрешения
