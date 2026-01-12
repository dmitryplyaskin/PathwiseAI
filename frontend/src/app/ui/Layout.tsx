import React, { Suspense, useState } from 'react';
import { Outlet, useLocation } from 'react-router';
import { useUnit } from 'effector-react';
import {
  Container,
  Box,
  IconButton,
  useMediaQuery,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { Breadcrumbs, useBreadcrumbs, AppLoader } from '@shared/ui';
import { $isAuthenticated } from '@shared/model/auth';
import { SideNav, DRAWER_COLLAPSED_WIDTH, DRAWER_WIDTH } from '@widgets/side-nav';

export const Layout: React.FC = () => {
  const location = useLocation();
  const breadcrumbs = useBreadcrumbs();
  const isAuthenticated = useUnit($isAuthenticated);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  // Не показываем хлебные крошки на главной странице и страницах авторизации
  const hideBreadcrumbsRoutes = ['/', '/login', '/register'];
  const shouldShowBreadcrumbs = !hideBreadcrumbsRoutes.includes(
    location.pathname,
  );

  const sideNavVariant = isDesktop ? 'permanent' : 'temporary';
  const sideNavOpen = isDesktop ? true : isNavOpen;
  const desktopNavWidth = isNavCollapsed ? DRAWER_COLLAPSED_WIDTH : DRAWER_WIDTH;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {isAuthenticated && (
        <SideNav
          variant={sideNavVariant}
          open={sideNavOpen}
          onClose={() => setIsNavOpen(false)}
          collapsed={isDesktop ? isNavCollapsed : false}
          onToggleCollapsed={
            isDesktop ? () => setIsNavCollapsed((v) => !v) : undefined
          }
        />
      )}

      <Box
        sx={{
          flexGrow: 1,
          minWidth: 0,
          ...(isAuthenticated && isDesktop ? { width: `calc(100% - ${desktopNavWidth}px)` } : null),
        }}
      >
        {isAuthenticated && !isDesktop && (
          <IconButton
            onClick={() => setIsNavOpen(true)}
            aria-label="Открыть меню навигации"
            sx={{
              position: 'fixed',
              top: 12,
              left: 12,
              zIndex: (t) => t.zIndex.drawer + 1,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
              '&:hover': {
                bgcolor: 'background.paper',
                opacity: 0.95,
              },
            }}
          >
            <MenuIcon />
          </IconButton>
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
    </Box>
  );
};
