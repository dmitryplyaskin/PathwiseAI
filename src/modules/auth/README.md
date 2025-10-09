# Модуль авторизации

Этот модуль реализует систему авторизации с использованием Passport.js и JWT токенов.

## Возможности

- Регистрация пользователей
- Авторизация по email и паролю
- JWT токены для аутентификации
- Защищенные эндпоинты
- Настраиваемое время жизни токена (включая бесконечное)

## API Эндпоинты

### Регистрация

```
POST /auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123",
  "settings": {}
}
```

### Авторизация

```
POST /auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

### Получение профиля (требует авторизации)

```
GET /profile
Authorization: Bearer <jwt_token>
```

## Переменные окружения

```env
# Обязательные
JWT_SECRET=your_jwt_secret_key_here_change_in_production

# Опциональные
JWT_EXPIRES_IN=24h  # или never для бесконечного времени жизни
```

## Использование в других контроллерах

### Защита эндпоинта

```typescript
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('example')
export class ExampleController {
  @UseGuards(JwtAuthGuard)
  @Get('protected')
  getProtectedData(@CurrentUser() user: any) {
    return { message: `Hello ${user.username}` };
  }
}
```

### Глобальная защита модуля

```typescript
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

## Безопасность

- Пароли хешируются с использованием bcrypt
- JWT токены подписываются секретным ключом
- Время жизни токена настраивается через переменные окружения
- Поддержка бесконечного времени жизни токена
