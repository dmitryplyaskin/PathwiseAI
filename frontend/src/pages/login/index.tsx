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

export const LoginPage = () => {
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
              Добро пожаловать! Пожалуйста, войдите в свой аккаунт.
            </Typography>
          </Box>

          <Stack spacing={2} component="form">
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
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              sx={{ mt: 2 }}
            >
              Войти
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
