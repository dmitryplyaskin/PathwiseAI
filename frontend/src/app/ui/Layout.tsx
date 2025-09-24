import React from 'react';
import { Outlet, useLocation } from 'react-router';
import { Container, Box } from '@mui/material';
import { Breadcrumbs, useBreadcrumbs } from '../../shared/ui';

export const Layout: React.FC = () => {
  const location = useLocation();
  const breadcrumbs = useBreadcrumbs();

  // Не показываем хлебные крошки на главной странице и страницах авторизации
  const hideBreadcrumbsRoutes = ['/', '/login', '/register'];
  const shouldShowBreadcrumbs = !hideBreadcrumbsRoutes.includes(
    location.pathname,
  );

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {shouldShowBreadcrumbs && (
        <Container maxWidth="lg" sx={{ pt: 3 }}>
          <Breadcrumbs items={breadcrumbs} />
        </Container>
      )}
      <Outlet />
    </Box>
  );
};
