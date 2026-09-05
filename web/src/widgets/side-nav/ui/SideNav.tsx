import { Link, useLocation } from 'react-router';
import { useUnit } from 'effector-react';
import {
  Avatar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Close,
  LogoutOutlined,
  RouteOutlined,
} from '@mui/icons-material';
import { $currentUser, logoutRequested } from '@shared/model/auth';
import {
  DRAWER_WIDTH,
  DRAWER_COLLAPSED_WIDTH,
  NAVIGATION,
  matchesNavigation,
} from '../navigation';

export type SideNavProps = {
  variant?: 'temporary' | 'permanent';
  open: boolean;
  onClose: () => void;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
};

export const SideNav = ({
  variant = 'temporary',
  open,
  onClose,
  collapsed = false,
  onToggleCollapsed,
}: SideNavProps) => {
  const { pathname } = useLocation();
  const currentUser = useUnit($currentUser);
  const mobile = variant === 'temporary';
  const compact = !mobile && collapsed;
  const width = compact ? DRAWER_COLLAPSED_WIDTH : DRAWER_WIDTH;
  const closeOnNavigate = mobile ? onClose : undefined;
  const toggleLabel = compact ? 'Развернуть меню' : 'Свернуть меню';

  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        width: mobile ? 0 : width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width,
          maxWidth: 'calc(100vw - 24px)',
          boxSizing: 'border-box',
          borderRadius: 0,
          borderRight: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          backgroundImage: 'none',
          boxShadow: 'none',
          overflowX: 'hidden',
        },
      }}
    >
      <Box
        component="nav"
        aria-label="Основная навигация"
        sx={{
          minHeight: '100%',
          display: 'flex',
          flexDirection: 'column',
          p: 1.5,
          pb: 'max(12px, env(safe-area-inset-bottom))',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            minHeight: 64,
            mb: 3,
            justifyContent: compact ? 'center' : undefined,
          }}
        >
          <Box
            component={Link}
            to="/"
            onClick={closeOnNavigate}
            aria-label="PathwiseAI — главная"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
              textDecoration: 'none',
              color: 'text.primary',
              minWidth: 0,
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                display: 'grid',
                placeItems: 'center',
                bgcolor: 'primary.main',
                color: 'white',
                borderRadius: '12px',
                flexShrink: 0,
              }}
            >
              <RouteOutlined />
            </Box>
            {!compact && (
              <Typography
                component="span"
                sx={{
                  fontSize: '1.1rem',
                  fontWeight: 750,
                  letterSpacing: '-0.035em',
                }}
              >
                Pathwise
                <Box component="span" sx={{ color: 'primary.main' }}>
                  AI
                </Box>
              </Typography>
            )}
          </Box>
          {mobile && (
            <IconButton
              onClick={onClose}
              aria-label="Закрыть меню"
              sx={{ ml: 'auto' }}
            >
              <Close />
            </IconButton>
          )}
        </Box>

        {!compact && (
          <Typography
            component="p"
            variant="overline"
            sx={{
              px: 1.5,
              mb: 1,
              color: 'text.secondary',
              fontSize: '0.65rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
            }}
          >
            Обучение
          </Typography>
        )}
        <List disablePadding sx={{ display: 'grid', gap: 0.75 }}>
          {NAVIGATION.map((item) => {
            const selected = matchesNavigation(pathname, item);
            const Icon = item.icon;
            return (
              <ListItem key={item.to} disablePadding sx={{ display: 'block' }}>
                <Tooltip
                  title={compact ? item.label : ''}
                  placement="right"
                  arrow
                >
                  <ListItemButton
                    component={Link}
                    to={item.to}
                    onClick={closeOnNavigate}
                    selected={selected}
                    aria-current={selected ? 'page' : undefined}
                    aria-label={item.label}
                    sx={{
                      minHeight: 46,
                      px: 1.5,
                      borderRadius: '10px',
                      gap: 1.5,
                      color: 'text.secondary',
                      '&:hover': { bgcolor: 'grey.50', color: 'text.primary' },
                      '&.Mui-selected': {
                        bgcolor: 'primary.50',
                        color: 'primary.dark',
                      },
                      '&.Mui-selected:hover': { bgcolor: 'primary.100' },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 24, color: 'inherit' }}>
                      <Icon sx={{ fontSize: 22 }} />
                    </ListItemIcon>
                    {!compact && (
                      <ListItemText
                        primary={item.label}
                        slotProps={{
                          primary: {
                            fontSize: '0.875rem',
                            fontWeight: selected ? 650 : 500,
                            color: 'inherit',
                          },
                        }}
                      />
                    )}
                    {selected && !compact && (
                      <Box
                        aria-hidden="true"
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          bgcolor: 'primary.main',
                          flexShrink: 0,
                        }}
                      />
                    )}
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            );
          })}
        </List>

        <Box sx={{ mt: 'auto', pt: 4 }}>
          {!compact && (
            <Box sx={{ p: 2, mb: 2, borderRadius: '14px', bgcolor: 'grey.50' }}>
              <RouteOutlined
                sx={{ color: 'primary.main', fontSize: 22, mb: 1 }}
              />
              <Typography
                sx={{
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: 'text.primary',
                  mb: 0.5,
                }}
              >
                В своём темпе
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontSize: '0.75rem', lineHeight: 1.6 }}
              >
                Изучайте новое и возвращайтесь к важному.
              </Typography>
            </Box>
          )}
          {!mobile && (
            <Tooltip title={compact ? toggleLabel : ''} placement="right">
              <ListItemButton
                component="button"
                onClick={onToggleCollapsed}
                aria-label={toggleLabel}
                aria-expanded={!compact}
                sx={{
                  width: '100%',
                  minHeight: 44,
                  borderRadius: '10px',
                  px: 1.5,
                  gap: 1.5,
                  mb: 1.5,
                  color: 'text.secondary',
                }}
              >
                {compact ? <ChevronRight /> : <ChevronLeft />}
                {!compact && (
                  <Typography variant="body2">Свернуть меню</Typography>
                )}
              </ListItemButton>
            </Tooltip>
          )}
          <Box
            sx={{
              borderTop: '1px solid',
              borderColor: 'divider',
              pt: 1.5,
              display: 'flex',
              flexDirection: compact ? 'column' : 'row',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            <Tooltip title={compact ? 'Профиль' : ''} placement="right">
              <ListItemButton
                component={Link}
                to="/profile"
                onClick={closeOnNavigate}
                aria-label="Профиль"
                aria-current={pathname === '/profile' ? 'page' : undefined}
                selected={pathname === '/profile'}
                sx={{
                  minWidth: 0,
                  borderRadius: '10px',
                  p: 0.75,
                  gap: 1.25,
                  flex: compact ? undefined : 1,
                }}
              >
                <Avatar
                  sx={{
                    width: 34,
                    height: 34,
                    bgcolor: 'primary.100',
                    color: 'primary.dark',
                    fontSize: '0.85rem',
                    fontWeight: 650,
                  }}
                >
                  {currentUser?.username.charAt(0).toUpperCase() || 'P'}
                </Avatar>
                {!compact && (
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      title={currentUser?.username}
                      noWrap
                      sx={{
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: 'text.primary',
                      }}
                    >
                      {currentUser?.username || 'Профиль'}
                    </Typography>
                    <Typography
                      sx={{ fontSize: '0.7rem', color: 'text.secondary' }}
                    >
                      {currentUser?.role === 'admin'
                        ? 'Администратор'
                        : 'Личный аккаунт'}
                    </Typography>
                  </Box>
                )}
              </ListItemButton>
            </Tooltip>
            <Tooltip title="Выйти" placement="right">
              <IconButton
                aria-label="Выйти"
                onClick={() => {
                  logoutRequested();
                  onClose();
                }}
                sx={{ width: 40, height: 40, color: 'text.secondary' }}
              >
                <LogoutOutlined sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};
