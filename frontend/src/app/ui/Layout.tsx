import React, { Suspense } from 'react';
import { Outlet, useLocation, Link } from 'react-router';
import { useUnit } from 'effector-react';
import {
  Container,
  Box,
  AppBar,
  Toolbar,
  Typography,
  Stack,
} from '@mui/material';
import { Breadcrumbs, useBreadcrumbs, AppLoader } from '@shared/ui';
import { $isAuthenticated } from '@shared/model/auth';
import { UserMenu } from '@widgets/user-menu';

export const Layout: React.FC = () => {
  const location = useLocation();
  const breadcrumbs = useBreadcrumbs();
  const isAuthenticated = useUnit($isAuthenticated);

  // Не показываем хлебные крошки на главной странице и страницах авторизации
  const hideBreadcrumbsRoutes = ['/', '/login', '/register'];
  const shouldShowBreadcrumbs = !hideBreadcrumbsRoutes.includes(
    location.pathname,
  );

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {isAuthenticated && (
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                flexGrow: 1,
                textDecoration: 'none',
                color: 'inherit',
                cursor: 'pointer',
                '&:hover': {
                  opacity: 0.8,
                },
              }}
            >
              PathwiseAI
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <UserMenu />
            </Stack>
          </Toolbar>
        </AppBar>
      )}

      {shouldShowBreadcrumbs && (
        <Container maxWidth="lg" sx={{ pt: 3 }}>
          <Breadcrumbs items={breadcrumbs} />
        </Container>
      )}
      <Suspense fallback={<AppLoader />}>
        <Outlet />
      </Suspense>
    </Box>
  );
};
