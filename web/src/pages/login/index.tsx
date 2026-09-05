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
  loginRequested,
  $authLoading,
  $loginError,
  $isAuthenticated,
} from '@shared/model/auth';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [login, setLogin] = useState('');
  const [authLoading, loginError, isAuthenticated] = useUnit([
    $authLoading,
    $loginError,
    $isAuthenticated,
  ]);

  // Статичный пароль как указано в требованиях
  const STATIC_PASSWORD = 'password123';

  // Перенаправляем на главную страницу после успешной авторизации
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!login.trim()) {
      return;
    }

    try {
      await loginRequested({
        login: login.trim(),
        password: STATIC_PASSWORD,
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
              Вход
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Добро пожаловать! Введите ваш логин (email или username).
            </Typography>
          </Box>

          {loginError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {loginError}
            </Alert>
          )}

          <Stack spacing={2} component="form" onSubmit={handleSubmit}>
            <TextField
              label="Логин (email или username)"
              type="text"
              variant="outlined"
              fullWidth
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              disabled={authLoading}
              required
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              sx={{ mt: 2 }}
              disabled={authLoading || !login.trim()}
            >
              {authLoading ? 'Вход...' : 'Войти'}
            </Button>
          </Stack>

          <Typography variant="body2" textAlign="center">
            Нет аккаунта?{' '}
            <MuiLink component={Link} to="/register" underline="hover">
              Зарегистрироваться
            </MuiLink>
          </Typography>
        </Stack>
      </Card>
    </Container>
  );
};
