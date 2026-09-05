import { Suspense, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router';
import { useUnit } from 'effector-react';
import { Container, Box, IconButton, useMediaQuery } from '@mui/material';
import { MenuOutlined } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { Breadcrumbs, useBreadcrumbs, AppLoader } from '@shared/ui';
import { $isAuthenticated } from '@shared/model/auth';
import { SideNav } from '@widgets/side-nav';
import { SIDEBAR_COLLAPSED_STORAGE_KEY } from '@widgets/side-nav/navigation';

export const Layout = () => {
  const location = useLocation();
  const breadcrumbs = useBreadcrumbs();
  const isAuthenticated = useUnit($isAuthenticated);
  const [navOpenAt, setNavOpenAt] = useState<string | null>(null);
  const [isNavCollapsed, setIsNavCollapsed] = useState(() => {
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
      /* Navigation remains usable when storage is unavailable. */
    }
  }, [isDesktop, isNavCollapsed]);

  useEffect(() => {
    if (isDesktop) setNavOpenAt(null);
  }, [isDesktop]);

  const showBreadcrumbs = !['/', '/login', '/register'].includes(
    location.pathname,
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100dvh' }}>
      <Box
        component="a"
        href="#main-content"
        sx={{
          position: 'fixed',
          top: 8,
          left: 8,
          transform: 'translateY(-160%)',
          zIndex: theme.zIndex.modal + 1,
          bgcolor: 'background.paper',
          p: 1.5,
          borderRadius: 1,
          '&:focus': { transform: 'none' },
        }}
      >
        Перейти к содержимому
      </Box>
      {isAuthenticated && (
        <SideNav
          variant={isDesktop ? 'permanent' : 'temporary'}
          open={isDesktop || navOpenAt === location.key}
          onClose={() => setNavOpenAt(null)}
          collapsed={isNavCollapsed}
          onToggleCollapsed={() => setIsNavCollapsed((value) => !value)}
        />
      )}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box
          component="main"
          id="main-content"
          tabIndex={-1}
          sx={{ pb: isAuthenticated ? 4 : 0 }}
        >
          {(showBreadcrumbs || (isAuthenticated && !isDesktop)) && (
            <Container
              maxWidth="lg"
              sx={{
                pt: { xs: 1.5, md: 3 },
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              {isAuthenticated && !isDesktop && (
                <IconButton
                  aria-label="Открыть меню навигации"
                  aria-expanded={navOpenAt === location.key}
                  onClick={() => setNavOpenAt(location.key)}
                  sx={{ width: 44, height: 44, flexShrink: 0 }}
                >
                  <MenuOutlined />
                </IconButton>
              )}
              {showBreadcrumbs && (
                <Box sx={{ minWidth: 0 }}>
                  <Breadcrumbs items={breadcrumbs} />
                </Box>
              )}
            </Container>
          )}
          <Suspense fallback={<AppLoader />}>
            <Outlet />
          </Suspense>
        </Box>
      </Box>
    </Box>
  );
};
