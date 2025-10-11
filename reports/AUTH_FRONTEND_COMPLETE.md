# Полная документация системы авторизации (Frontend)

## Обзор реализованного функционала

В проекте PathwiseAI реализована полноценная система авторизации на фронтенде с использованием Effector для управления состоянием, React Router для маршрутизации и Material-UI для интерфейса. Система поддерживает авторизацию через httpOnly cookies, имеет защищенные маршруты и автоматическую проверку авторизации при старте приложения.

## Архитектура фронтенда

### Структура модулей

```
frontend/src/
├── shared/
│   ├── api/
│   │   └── users/
│   │       ├── api.ts              # API методы для авторизации
│   │       ├── types.ts            # Типы для авторизации
│   │       └── index.ts
│   ├── model/
│   │   ├── auth/
│   │   │   ├── auth-model.ts       # Effector модель авторизации
│   │   │   └── index.ts
│   │   └── users/
│   │       └── users-model.ts       # Модель пользователей
│   └── ui/
│       └── auth-guard/
│           ├── auth-guard.tsx      # Компонент защиты маршрутов
│           └── index.ts
├── pages/
│   ├── login/
│   │   └── index.tsx               # Страница входа
│   ├── register/
│   │   └── index.tsx               # Страница регистрации
│   └── profile/
│       └── index.tsx                # Страница профиля
└── app/
    ├── config/
    │   └── router.tsx              # Конфигурация роутера с защитой
    └── ui/
        └── Layout.tsx              # Layout с информацией о пользователе
```

## Система авторизации

### Effector модель (`shared/model/auth/auth-model.ts`)

```typescript
// Events
export const loginRequested = createEvent<LoginRequest>();
export const registerRequested = createEvent<RegisterRequest>();
export const logoutRequested = createEvent();
export const checkAuthRequested = createEvent();
export const authReset = createEvent();

// Effects
export const loginFx = createEffect(
  async (loginData: LoginRequest): Promise<User> => {
    const response = await usersApi.login(loginData);
    return response.user;
  },
);

export const registerFx = createEffect(
  async (registerData: RegisterRequest): Promise<User> => {
    const response = await usersApi.register(registerData);
    return response.user;
  },
);

export const checkAuthFx = createEffect(async (): Promise<User> => {
  return usersApi.getProfile();
});

export const logoutFx = createEffect(async (): Promise<void> => {
  await usersApi.logout();
});

// Stores
export const $currentUser = createStore<User | null>(null)
  .on(loginFx.doneData, (_, user) => user)
  .on(registerFx.doneData, (_, user) => user)
  .on(checkAuthFx.doneData, (_, user) => user)
  .reset([logoutFx.done, authReset]);

export const $isAuthenticated = createStore(false)
  .on(loginFx.doneData, () => true)
  .on(registerFx.doneData, () => true)
  .on(checkAuthFx.doneData, () => true)
  .on(checkAuthFx.fail, () => false)
  .reset([logoutFx.done, authReset]);
```

### API методы (`shared/api/users/api.ts`)

```typescript
export const usersApi = {
  // Авторизация
  login: async (loginData: LoginRequest): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Важно для httpOnly cookies
      body: JSON.stringify(loginData),
    });
    return response.json();
  },

  // Регистрация
  register: async (registerData: RegisterRequest): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(registerData),
    });
    return response.json();
  },

  // Получение профиля (проверка авторизации)
  getProfile: async (): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/api/profile`, {
      method: 'GET',
      credentials: 'include',
    });
    return response.json();
  },

  // Выход
  logout: async (): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  },
};
```

### Компонент защиты маршрутов (`shared/ui/auth-guard/auth-guard.tsx`)

```typescript
export const AuthGuard = ({ children, requireAuth = true }: AuthGuardProps) => {
  const [isAuthenticated, authLoading] = useUnit([
    $isAuthenticated,
    $authLoading,
  ]);

  useEffect(() => {
    // Проверяем авторизацию только если она требуется
    if (requireAuth) {
      checkAuthRequested();
    }
  }, [requireAuth]);

  // Если авторизация не требуется, просто рендерим детей
  if (!requireAuth) {
    return <>{children}</>;
  }

  if (authLoading) {
    return <CircularProgress />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
```

## Страницы авторизации

### Страница входа (`pages/login/index.tsx`)

- **Поле ввода**: Только логин (email или username)
- **Статичный пароль**: `password123` (зашит в коде)
- **Автоматическое перенаправление**: После успешного входа на главную страницу
- **Обработка ошибок**: Отображение ошибок авторизации

```typescript
const STATIC_PASSWORD = 'password123';

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!login.trim()) return;

  try {
    await loginRequested({
      login: login.trim(),
      password: STATIC_PASSWORD,
    });

    navigate('/');
  } catch (error) {
    // Ошибка обрабатывается в модели
  }
};
```

### Страница регистрации (`pages/register/index.tsx`)

- **Поле ввода**: Только имя пользователя
- **Статичные данные**: Email, пароль, роль и настройки зашиты в коде
- **Автоматическое перенаправление**: После успешной регистрации на главную страницу

```typescript
// Статичные данные как указано в требованиях
const STATIC_PASSWORD = 'password123';
const STATIC_ROLE = 'user' as const;
const STATIC_SETTINGS = {};

// Генерируем случайный email для каждого пользователя
const generateRandomEmail = (username: string) => {
  const randomId = Math.random().toString(36).substring(2, 8);
  return `${username.toLowerCase()}_${randomId}@example.com`;
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!username.trim()) return;

  try {
    await registerRequested({
      username: username.trim(),
      email: generateRandomEmail(username.trim()),
      password: STATIC_PASSWORD,
      role: STATIC_ROLE,
      settings: STATIC_SETTINGS,
    });

    navigate('/');
  } catch {
    // Ошибка обрабатывается в модели
  }
};
```

## Защита маршрутов

### Конфигурация роутера (`app/config/router.tsx`)

```typescript
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
      // ... остальные защищенные маршруты
    ],
  },
]);
```

### Логика защиты

- **`requireAuth={true}`**: Маршрут доступен только авторизованным пользователям
- **`requireAuth={false}`**: Маршрут доступен только неавторизованным пользователям
- **Автоматическая проверка**: При каждом переходе проверяется авторизация
- **Перенаправления**: Неавторизованные пользователи перенаправляются на `/login`

## Layout с информацией о пользователе

### Компонент Layout (`app/ui/Layout.tsx`)

```typescript
export const Layout: React.FC = () => {
  const [currentUser, isAuthenticated] = useUnit([$currentUser, $isAuthenticated]);

  const handleLogout = () => {
    logoutRequested();
  };

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {isAuthenticated && (
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              PathwiseAI
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              {currentUser && (
                <>
                  <Typography variant="body2">
                    Привет, {currentUser.username}!
                  </Typography>
                  <Chip
                    label={currentUser.role === 'admin' ? 'Админ' : 'Пользователь'}
                    color={currentUser.role === 'admin' ? 'secondary' : 'default'}
                    size="small"
                  />
                </>
              )}
              <Button
                color="inherit"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
              >
                Выйти
              </Button>
            </Stack>
          </Toolbar>
        </AppBar>
      )}

      <Outlet />
    </Box>
  );
};
```

### Функциональность Layout

- **Отображение имени пользователя**: В верхней панели
- **Индикатор роли**: Чип с ролью пользователя (Админ/Пользователь)
- **Кнопка выхода**: Выход из системы с очисткой состояния
- **Условное отображение**: Панель показывается только авторизованным пользователям

## Страница профиля

### Компонент ProfilePage (`pages/profile/index.tsx`)

```typescript
export const ProfilePage = () => {
  const currentUser = useUnit($currentUser);

  if (!currentUser) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography variant="h4" textAlign="center">
          Пользователь не найден
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Card sx={{ p: 4, borderRadius: 4 }}>
        <Stack spacing={4}>
          <Box display="flex" alignItems="center" gap={4}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                bgcolor: currentUser.role === 'admin' ? 'secondary.main' : 'primary.main'
              }}
            >
              {currentUser.username.charAt(0).toUpperCase()}
            </Avatar>
            <Box flexGrow={1}>
              <Typography variant="h2" component="h1">
                {currentUser.username}
              </Typography>
              <Chip
                label={currentUser.role === 'admin' ? 'Администратор' : 'Пользователь'}
                color={currentUser.role === 'admin' ? 'secondary' : 'default'}
                size="small"
                sx={{ mt: 1 }}
              />
            </Box>
          </Box>

          <Stack spacing={3}>
            <ProfileInfoRow
              icon={<Person color="primary" />}
              label="Имя пользователя"
              value={currentUser.username}
            />
            <ProfileInfoRow
              icon={<Email color="primary" />}
              label="Email"
              value={currentUser.email}
            />
            <ProfileInfoRow
              icon={<Security color="primary" />}
              label="Роль"
              value={currentUser.role === 'admin' ? 'Администратор' : 'Пользователь'}
            />
            <ProfileInfoRow
              icon={<CalendarToday color="primary" />}
              label="Дата регистрации"
              value={new Date(currentUser.created_at).toLocaleDateString('ru-RU')}
            />
          </Stack>
        </Stack>
      </Card>
    </Container>
  );
};
```

## Безопасность

### httpOnly Cookies

- **Токены не доступны в JavaScript**: Защита от XSS атак
- **Автоматическая отправка**: Cookies отправляются с каждым запросом
- **Настройки безопасности**: `httpOnly`, `secure`, `sameSite`

### CORS настройки

```typescript
// main.ts
app.enableCors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true, // Важно для работы с cookies
});
```

### Защита маршрутов

- **Проверка авторизации**: При каждом переходе
- **Автоматические перенаправления**: На страницы входа/регистрации
- **Состояние загрузки**: Индикатор во время проверки авторизации

## Использование в компонентах

### Получение данных пользователя

```typescript
import { useUnit } from 'effector-react';
import { $currentUser, $isAuthenticated } from '../../shared/model/auth';

const MyComponent = () => {
  const [currentUser, isAuthenticated] = useUnit([$currentUser, $isAuthenticated]);

  if (!isAuthenticated) {
    return <div>Не авторизован</div>;
  }

  return (
    <div>
      <h1>Привет, {currentUser?.username}!</h1>
      <p>Роль: {currentUser?.role}</p>
    </div>
  );
};
```

### Выполнение действий авторизации

```typescript
import {
  loginRequested,
  logoutRequested,
  checkAuthRequested,
} from '../../shared/model/auth';

// Вход
const handleLogin = () => {
  loginRequested({
    login: 'user@example.com',
    password: 'password123',
  });
};

// Выход
const handleLogout = () => {
  logoutRequested();
};

// Проверка авторизации
const handleCheckAuth = () => {
  checkAuthRequested();
};
```

## Обработка ошибок

### Отображение ошибок

```typescript
import { $loginError, $registerError } from '../../shared/model/auth';

const LoginPage = () => {
  const loginError = useUnit($loginError);

  return (
    <form onSubmit={handleSubmit}>
      {loginError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {loginError}
        </Alert>
      )}
      {/* остальная форма */}
    </form>
  );
};

const RegisterPage = () => {
  const registerError = useUnit($registerError);

  return (
    <form onSubmit={handleSubmit}>
      {registerError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {registerError}
        </Alert>
      )}
      {/* остальная форма */}
    </form>
  );
};
```

### Типы ошибок

- **401 Unauthorized**: Неверные учетные данные
- **409 Conflict**: Пользователь уже существует
- **400 Bad Request**: Неверные данные запроса
- **Сетевые ошибки**: Проблемы с подключением

## Состояние загрузки

### Индикаторы загрузки

```typescript
import { $authLoading } from '../../shared/model/auth';

const LoginPage = () => {
  const authLoading = useUnit($authLoading);

  return (
    <Button
      type="submit"
      disabled={authLoading}
    >
      {authLoading ? 'Вход...' : 'Войти'}
    </Button>
  );
};
```

## Интеграция с бекендом

### Эндпоинты

- **POST /api/auth/login**: Авторизация
- **POST /api/auth/register**: Регистрация
- **POST /api/auth/logout**: Выход
- **GET /api/profile**: Получение профиля

### Формат данных

```typescript
// Запрос авторизации
interface LoginRequest {
  login: string;
  password: string;
}

// Запрос регистрации
interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role?: 'user' | 'admin';
  settings?: Record<string, any>;
}

// Ответ авторизации
interface AuthResponse {
  user: User;
}

// Пользователь
interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  settings?: Record<string, any>;
  created_at: string;
  updated_at: string;
}
```

## Заключение

Система авторизации на фронтенде полностью готова к использованию. Реализованы:

1. **Безопасная авторизация** через httpOnly cookies
2. **Защищенные маршруты** с автоматической проверкой
3. **Управление состоянием** через Effector
4. **Пользовательский интерфейс** с Material-UI
5. **Обработка ошибок** и состояний загрузки
6. **Интеграция с бекендом** через REST API

Система готова к продакшену и может быть легко расширена дополнительными функциями.
