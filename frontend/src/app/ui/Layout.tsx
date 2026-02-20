import React, { Suspense, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router';
import { useUnit } from 'effector-react';
import {
  Container,
  Box,
  IconButton,
  useMediaQuery,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import { Breadcrumbs, useBreadcrumbs, AppLoader } from '@shared/ui';
import { $isAuthenticated } from '@shared/model/auth';
import { SideNav, DRAWER_COLLAPSED_WIDTH, DRAWER_WIDTH } from '@widgets/side-nav';

const SIDEBAR_COLLAPSED_STORAGE_KEY = 'pathwise.sidebar.collapsed.v1';

export const Layout: React.FC = () => {
  const location = useLocation();
  const breadcrumbs = useBreadcrumbs();
  const isAuthenticated = useUnit($isAuthenticated);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isNavCollapsed, setIsNavCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false;

    try {
      return window.localStorage.getItem(SIDEBAR_COLLAPSED_STORAGE_KEY) === '1';
    } catch {
      return false;
    }
  });
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  useEffect(() => {
    if (!isDesktop) return;

    try {
      window.localStorage.setItem(
        SIDEBAR_COLLAPSED_STORAGE_KEY,
        isNavCollapsed ? '1' : '0',
      );
    } catch {
      // В приватных режимах/при блокировке storage просто пропускаем персист.
    }
  }, [isDesktop, isNavCollapsed]);

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
          transition: (t) =>
            t.transitions.create('width', {
              duration: t.transitions.duration.shorter,
              easing: t.transitions.easing.easeOut,
            }),
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
              bgcolor: alpha(theme.palette.background.paper, 0.96),
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 10px 28px rgba(15, 23, 42, 0.14)',
              backdropFilter: 'blur(6px)',
              transition: (t) =>
                t.transitions.create(['background-color', 'box-shadow'], {
                  duration: t.transitions.duration.shorter,
                }),
              '&:hover': {
                bgcolor: 'background.paper',
                boxShadow: '0 14px 30px rgba(15, 23, 42, 0.16)',
              },
              '&:focus-visible': {
                outline: `2px solid ${theme.palette.primary.main}`,
                outlineOffset: 2,
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
