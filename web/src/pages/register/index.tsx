import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useUnit } from 'effector-react';
import {
  Container,
  Box,
  Card,
  Typography,
  TextField,
  Button,
  Stack,
  Link as MuiLink,
  Alert,
} from '@mui/material';
import { Link } from 'react-router';
import {
  registerRequested,
  $authLoading,
  $registerError,
  $isAuthenticated,
} from '@shared/model/auth';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [authLoading, registerError, isAuthenticated] = useUnit([
    $authLoading,
    $registerError,
    $isAuthenticated,
  ]);

  // Статичные данные как указано в требованиях
  const STATIC_PASSWORD = 'password123';
  const STATIC_ROLE = 'user' as const;
  const STATIC_SETTINGS = {};

  // Генерируем случайный email для каждого пользователя
  const generateRandomEmail = (username: string) => {
    const randomId = Math.random().toString(36).substring(2, 8);
    return `${username.toLowerCase()}_${randomId}@example.com`;
  };

  // Перенаправляем на главную страницу после успешной регистрации
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      return;
    }

    try {
      await registerRequested({
        username: username.trim(),
        email: generateRandomEmail(username.trim()),
        password: STATIC_PASSWORD,
        role: STATIC_ROLE,
        settings: STATIC_SETTINGS,
      });
      // Навигация происходит в useEffect при изменении isAuthenticated
    } catch {
      // Ошибка обрабатывается в модели
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
    >
      <Card sx={{ p: 4, borderRadius: 4 }}>
        <Stack spacing={4}>
          <Box textAlign="center">
            <Typography variant="h2" component="h1" gutterBottom>
              Регистрация
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Создайте новый аккаунт. Введите только ваше имя пользователя.
            </Typography>
          </Box>

          {registerError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {registerError}
            </Alert>
          )}

          <Stack spacing={2} component="form" onSubmit={handleSubmit}>
            <TextField
              label="Имя пользователя"
              type="text"
              variant="outlined"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={authLoading}
              required
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              sx={{ mt: 2 }}
              disabled={authLoading || !username.trim()}
            >
              {authLoading ? 'Регистрация...' : 'Зарегистрироваться'}
            </Button>
          </Stack>

          <Typography variant="body2" textAlign="center">
            Уже есть аккаунт?{' '}
            <MuiLink component={Link} to="/login" underline="hover">
              Войти
            </MuiLink>
          </Typography>
        </Stack>
      </Card>
    </Container>
  );
};
