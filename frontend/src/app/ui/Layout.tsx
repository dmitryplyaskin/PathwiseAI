import React from 'react';
import { Outlet, useLocation, Link } from 'react-router';
import { useUnit } from 'effector-react';
import {
  Container,
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Chip,
  Stack,
} from '@mui/material';
import { Logout as LogoutIcon, Quiz, AccessTime } from '@mui/icons-material';
import { Breadcrumbs, useBreadcrumbs } from '@shared/ui';
import {
  $currentUser,
  $isAuthenticated,
  logoutRequested,
} from '@shared/model/auth';

export const Layout: React.FC = () => {
  const location = useLocation();
  const breadcrumbs = useBreadcrumbs();
  const [currentUser, isAuthenticated] = useUnit([
    $currentUser,
    $isAuthenticated,
  ]);

  // Не показываем хлебные крошки на главной странице и страницах авторизации
  const hideBreadcrumbsRoutes = ['/', '/login', '/register'];
  const shouldShowBreadcrumbs = !hideBreadcrumbsRoutes.includes(
    location.pathname,
  );

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
                    label={
                      currentUser.role === 'admin' ? 'Админ' : 'Пользователь'
                    }
                    color={
                      currentUser.role === 'admin' ? 'secondary' : 'default'
                    }
                    size="small"
                  />
                  <Button
                    component={Link}
                    to="/test-history"
                    color="inherit"
                    startIcon={<Quiz />}
                    sx={{ textDecoration: 'none' }}
                  >
                    История тестов
                  </Button>
                  <Button
                    component={Link}
                    to="/review"
                    color="inherit"
                    startIcon={<AccessTime />}
                    sx={{ textDecoration: 'none' }}
                  >
                    Повторение
                  </Button>
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

      {shouldShowBreadcrumbs && (
        <Container maxWidth="lg" sx={{ pt: 3 }}>
          <Breadcrumbs items={breadcrumbs} />
        </Container>
      )}
      <Outlet />
    </Box>
  );
};
