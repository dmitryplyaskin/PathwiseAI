import {
  Container,
  Box,
  Card,
  Typography,
  TextField,
  Button,
  Stack,
  Link as MuiLink,
} from '@mui/material';
import { Link } from 'react-router';

export const RegisterPage = () => {
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
              Создайте новый аккаунт для доступа к платформе.
            </Typography>
          </Box>

          <Stack spacing={2} component="form">
            <TextField
              label="Ваше имя"
              type="text"
              variant="outlined"
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
            />
            <TextField
              label="Пароль"
              type="password"
              variant="outlined"
              fullWidth
            />
            <TextField
              label="Подтвердите пароль"
              type="password"
              variant="outlined"
              fullWidth
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              sx={{ mt: 2 }}
            >
              Зарегистрироваться
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
