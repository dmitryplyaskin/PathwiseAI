# Полная документация системы авторизации (Backend)

## Обзор реализованного функционала

В проекте PathwiseAI реализована полноценная система авторизации с использованием Passport.js, JWT токенов и системы ролей. Система поддерживает авторизацию по email или username, имеет роли Admin и User, и настраиваемое время жизни токенов.

## Установленные пакеты

```bash
# Основные пакеты для авторизации
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

## Структура модулей

### Модуль авторизации (`src/modules/auth/`)

```
src/modules/auth/
├── controllers/
│   ├── auth.controller.ts      # POST /auth/register, POST /auth/login
│   ├── profile.controller.ts   # GET /profile (защищенный)
│   └── admin.controller.ts     # GET /admin/dashboard, GET /admin/info
├── services/
│   └── auth.service.ts         # Логика авторизации и регистрации
├── strategies/
│   ├── jwt.strategy.ts         # JWT стратегия Passport
│   └── local.strategy.ts       # Локальная стратегия Passport
├── guards/
│   ├── jwt-auth.guard.ts      # Guard для JWT токенов
│   ├── local-auth.guard.ts     # Guard для локальной авторизации
│   └── roles.guard.ts          # Guard для проверки ролей
├── decorators/
│   ├── current-user.decorator.ts # Декоратор @CurrentUser()
│   └── roles.decorator.ts      # Декоратор @Roles()
├── dto/
│   ├── login.dto.ts            # DTO для авторизации
│   └── register.dto.ts         # DTO для регистрации
├── auth.module.ts              # Основной модуль авторизации
└── README.md                   # Документация модуля
```

### Модуль пользователей (`src/modules/users/`)

```
src/modules/users/
├── entities/
│   └── user.entity.ts          # Сущность User с полем role
├── enums/
│   └── user-role.enum.ts      # Enum ролей (USER, ADMIN)
├── dto/
│   ├── create-user.dto.ts      # DTO создания пользователя
│   └── update-user.dto.ts      # DTO обновления пользователя
├── services/
│   └── users.service.ts        # Сервис пользователей
├── controllers/
│   └── users.controller.ts     # CRUD операции с пользователями
└── users.module.ts             # Модуль пользователей
```

## Система ролей

### Enum ролей

```typescript
// src/modules/users/enums/user-role.enum.ts
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}
```

### Сущность пользователя

```typescript
// src/modules/users/entities/user.entity.ts
@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  username: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar' })
  password_hash?: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ type: 'jsonb', nullable: true })
  settings: Record<string, any>;

  // ... остальные поля и связи
}
```

## API Эндпоинты

### 1. Регистрация пользователя

```http
POST /auth/register
Content-Type: application/json

{
  "username": "newuser",
  "email": "test@example.com",
  "password": "password123",
  "role": "admin",  // Опционально, по умолчанию "user"
  "settings": {}    // Опционально
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
    "role": "admin",
    "settings": {},
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### 2. Авторизация пользователя

```http
POST /auth/login
Content-Type: application/json

{
  "login": "test@example.com",  // Может быть email или username
  "password": "password123"
}
```

**Ответ:** (аналогичен регистрации)

### 3. Получение профиля пользователя

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
  "role": "admin",
  "settings": {},
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

### 4. Админская панель (только для админов)

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

### 5. Информация для всех авторизованных пользователей

```http
GET /admin/info
Authorization: Bearer <jwt_token>
```

**Ответ:**

```json
{
  "message": "Информация доступна всем авторизованным пользователям",
  "user": {
    "id": "uuid",
    "username": "newuser",
    "email": "test@example.com",
    "role": "user"
  }
}
```

## DTO для валидации

### LoginDto

```typescript
export class LoginDto {
  @IsString()
  @IsNotEmpty()
  login: string; // Может быть email или username

  @IsString()
  @IsNotEmpty()
  password: string;
}
```

### RegisterDto

```typescript
export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  password: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @IsObject()
  @IsOptional()
  settings?: Record<string, any>;
}
```

## Guards и декораторы

### JwtAuthGuard

```typescript
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

### RolesGuard

```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      return false;
    }

    return requiredRoles.some((role) => user.role === role);
  }
}
```

### Декоратор @CurrentUser

```typescript
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
```

### Декоратор @Roles

```typescript
export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
```

## Переменные окружения

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

## Стратегии Passport

### JWT Strategy

```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: any) {
    try {
      const user = await this.usersService.findOne(payload.sub);
      if (!user) {
        throw new UnauthorizedException();
      }
      // Добавляем роль из payload для быстрого доступа
      return {
        ...user,
        role: payload.role,
      };
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
```

### Local Strategy

```typescript
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'login', // Используем login вместо email
    });
  }

  async validate(login: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(login, password);
    if (!user) {
      throw new UnauthorizedException('Неверные учетные данные');
    }
    return user;
  }
}
```

## Сервисы

### AuthService

```typescript
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(login: string, password: string): Promise<any> {
    try {
      // Получаем пользователя по email или username (включая password_hash)
      const user = await this.usersService.findByLoginForAuth(login);

      if (
        user &&
        user.password_hash &&
        (await bcrypt.compare(password, user.password_hash))
      ) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password_hash, ...result } = user;
        return result;
      }
      return null;
    } catch {
      return null;
    }
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
      username: user.username,
      role: user.role,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        settings: user.settings,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    };
  }

  async register(userData: any) {
    const user = await this.usersService.create(userData);
    return this.login(user);
  }
}
```

### UsersService (добавленные методы)

```typescript
async findByLoginForAuth(login: string): Promise<User> {
  // Сначала пытаемся найти по email
  let user = await this.usersRepository.findOne({ where: { email: login } });

  // Если не найден по email, ищем по username
  if (!user) {
    user = await this.usersRepository.findOne({ where: { username: login } });
  }

  if (!user) {
    throw new NotFoundException(`User with login "${login}" not found`);
  }
  return user;
}
```

## Конфигурация модулей

### AuthModule

```typescript
@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const expiresIn = configService.get<string>('JWT_EXPIRES_IN');
        const signOptions: any = {};

        // Если JWT_EXPIRES_IN не установлен или равен 'never', токен не истекает
        if (expiresIn && expiresIn !== 'never') {
          signOptions.expiresIn = expiresIn;
        }

        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions,
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController, ProfileController, AdminController],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
```

### AppModule (добавлен AuthModule)

```typescript
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.development'],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      // ... конфигурация БД
    }),
    SharedModule,
    UsersModule,
    AuthModule, // Добавлен модуль авторизации
    CoursesModule,
    QuestionsModule,
    ExamsModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

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
      role: user.role,
    };
  }
}
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

## Безопасность

1. **Хеширование паролей**: Используется bcrypt с автоматической генерацией соли
2. **JWT токены**: Подписываются секретным ключом и содержат информацию о роли
3. **Валидация**: Все входные данные валидируются с помощью class-validator
4. **Защита от дублирования**: Проверка уникальности email и username
5. **Настраиваемое время жизни**: Возможность установить время жизни токена или сделать его бесконечным
6. **Проверка ролей**: Guards проверяют роли пользователей на уровне эндпоинтов

## Тестирование

### Примеры curl команд

```bash
# Регистрация пользователя
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"newuser","email":"user@example.com","password":"password123"}'

# Авторизация по email
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"login":"test@example.com","password":"password123"}'

# Авторизация по username
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"login":"newuser","password":"password123"}'

# Получение профиля
curl -X GET http://localhost:3000/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Админская панель
curl -X GET http://localhost:3000/admin/dashboard \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"

# Общий эндпоинт
curl -X GET http://localhost:3000/admin/info \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Ошибки и их коды

- `400 Bad Request` - Неверные данные запроса
- `401 Unauthorized` - Неверные учетные данные или отсутствие токена
- `403 Forbidden` - Недостаточно прав доступа (неправильная роль)
- `409 Conflict` - Пользователь с таким email/username уже существует
- `404 Not Found` - Пользователь не найден

## Интеграция с фронтендом

### Что нужно реализовать на фронтенде:

1. **Формы авторизации и регистрации**
   - Поле для email/username (login)
   - Поле для пароля
   - Опциональное поле для роли при регистрации

2. **Управление токенами**
   - Сохранение JWT токена в localStorage или cookies
   - Добавление токена в заголовок `Authorization: Bearer <token>` для всех запросов
   - Обработка истечения токена

3. **Обработка ролей**
   - Проверка роли пользователя для отображения элементов интерфейса
   - Различные интерфейсы для админов и обычных пользователей
   - Защита маршрутов по ролям

4. **Обработка ошибок**
   - Обработка ошибок 401 (Unauthorized) для перенаправления на страницу входа
   - Обработка ошибок 403 (Forbidden) для показа сообщений о недостатке прав
   - Валидация форм на клиенте

5. **Состояние приложения**
   - Глобальное состояние пользователя
   - Состояние авторизации
   - Кэширование данных пользователя

### Примеры запросов для фронтенда:

```javascript
// Регистрация
const register = async (userData) => {
  const response = await fetch('/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  return response.json();
};

// Авторизация
const login = async (loginData) => {
  const response = await fetch('/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(loginData),
  });
  return response.json();
};

// Защищенный запрос
const getProfile = async (token) => {
  const response = await fetch('/profile', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};
```

## Заключение

Система авторизации полностью готова к использованию. Backend предоставляет все необходимые эндпоинты для регистрации, авторизации, управления профилем и проверки ролей. JWT токены содержат всю необходимую информацию о пользователе, включая его роль, что позволяет фронтенду легко реализовать систему прав доступа.
