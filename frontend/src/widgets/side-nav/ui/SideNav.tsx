import React from 'react';
import { Link, useLocation } from 'react-router';
import { useUnit } from 'effector-react';
import {
  AccessTime as AccessTimeIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Home as HomeIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Quiz as QuizIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Chip,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import { $currentUser, logoutRequested } from '@shared/model/auth';

export const DRAWER_WIDTH = 296;
export const DRAWER_COLLAPSED_WIDTH = 84;

type NavItem = {
  label: string;
  to: string;
  icon: React.ReactNode;
  match?: 'exact' | 'prefix';
};

type NavSection = {
  title: string;
  items: NavItem[];
};

const NAV_SECTIONS: NavSection[] = [
  {
    title: 'Обзор',
    items: [{ label: 'Главная', to: '/', icon: <HomeIcon />, match: 'exact' }],
  },
  {
    title: 'Учёба',
    items: [
      { label: 'Курсы', to: '/courses', icon: <SchoolIcon />, match: 'prefix' },
      { label: 'Повторение', to: '/review', icon: <AccessTimeIcon />, match: 'exact' },
    ],
  },
  {
    title: 'Прогресс',
    items: [
      {
        label: 'История тестов',
        to: '/test-history',
        icon: <QuizIcon />,
        match: 'exact',
      },
    ],
  },
];

const PROFILE_NAV_ITEM: NavItem = {
  label: 'Профиль',
  to: '/profile',
  icon: <PersonIcon />,
  match: 'exact',
};

export type SideNavProps = {
  variant?: 'temporary' | 'permanent';
  open: boolean;
  onClose: () => void;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
};

export const SideNav: React.FC<SideNavProps> = ({
  variant = 'temporary',
  open,
  onClose,
  collapsed = false,
  onToggleCollapsed,
}) => {
  const location = useLocation();
  const currentUser = useUnit($currentUser);

  const isTemporary = variant === 'temporary';
  const isCollapsed = !isTemporary && collapsed;
  const drawerWidth = isCollapsed ? DRAWER_COLLAPSED_WIDTH : DRAWER_WIDTH;

  const isSelected = (item: NavItem) => {
    if (item.match === 'exact') return location.pathname === item.to;
    return location.pathname === item.to || location.pathname.startsWith(`${item.to}/`);
  };

  const getNavButtonSx = (selected: boolean) => ({
    position: 'relative',
    minHeight: 46,
    borderRadius: 2.5,
    mx: 1,
    px: isCollapsed ? 1.25 : 1.5,
    justifyContent: isCollapsed ? 'center' : 'flex-start',
    gap: isCollapsed ? 0 : 0.75,
    color: selected ? 'primary.dark' : 'text.secondary',
    transition: (theme: Theme) =>
      theme.transitions.create(['background-color', 'color', 'transform'], {
        duration: theme.transitions.duration.shorter,
        easing: theme.transitions.easing.easeOut,
      }),
    '&:hover': {
      backgroundColor: alpha('#3b82f6', 0.08),
      color: 'text.primary',
      transform: isCollapsed ? 'none' : 'translateX(2px)',
    },
    '&.Mui-selected': {
      backgroundColor: alpha('#3b82f6', 0.16),
      color: 'primary.dark',
    },
    '&.Mui-selected:hover': {
      backgroundColor: alpha('#3b82f6', 0.22),
    },
    ...(selected
      ? {
          '&::before': {
            content: '""',
            position: 'absolute',
            left: 0,
            top: 10,
            bottom: 10,
            width: 3,
            borderRadius: 2,
            backgroundColor: 'primary.main',
          },
        }
      : {}),
    '&.Mui-focusVisible': {
      outline: '2px solid',
      outlineColor: 'primary.main',
      outlineOffset: 2,
      backgroundColor: alpha('#3b82f6', 0.12),
    },
  });

  const renderLinkItem = (item: NavItem) => {
    const selected = isSelected(item);
    const button = (
      <ListItemButton
        key={item.to}
        component={Link}
        to={item.to}
        selected={selected}
        onClick={isTemporary ? onClose : undefined}
        aria-current={selected ? 'page' : undefined}
        aria-label={item.label}
        sx={getNavButtonSx(selected)}
      >
        <ListItemIcon
          sx={{
            minWidth: isCollapsed ? 'auto' : 38,
            color: selected ? 'primary.main' : 'text.secondary',
            justifyContent: 'center',
            transition: (theme) =>
              theme.transitions.create('color', {
                duration: theme.transitions.duration.shorter,
              }),
          }}
        >
          {item.icon}
        </ListItemIcon>

        {!isCollapsed && (
          <ListItemText
            primary={item.label}
            primaryTypographyProps={{
              fontWeight: selected ? 700 : 600,
              fontSize: '0.93rem',
              letterSpacing: '0.01em',
            }}
          />
        )}
      </ListItemButton>
    );

    if (!isCollapsed) return button;
    return (
      <Tooltip key={item.to} title={item.label} placement="right">
        {button}
      </Tooltip>
    );
  };

  const renderLogoutItem = () => {
    const itemLabel = 'Выйти';
    const button = (
      <ListItemButton
        onClick={() => {
          logoutRequested();
          if (isTemporary) onClose();
        }}
        aria-label={itemLabel}
        sx={{
          ...getNavButtonSx(false),
          color: 'error.main',
          '&:hover': {
            backgroundColor: alpha('#ef4444', 0.1),
            color: 'error.dark',
            transform: isCollapsed ? 'none' : 'translateX(2px)',
          },
          '&.Mui-focusVisible': {
            outlineColor: 'error.main',
            backgroundColor: alpha('#ef4444', 0.12),
          },
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: isCollapsed ? 'auto' : 38,
            color: 'error.main',
            justifyContent: 'center',
          }}
        >
          <LogoutIcon />
        </ListItemIcon>
        {!isCollapsed && (
          <ListItemText
            primary={itemLabel}
            primaryTypographyProps={{ fontWeight: 700, fontSize: '0.93rem' }}
          />
        )}
      </ListItemButton>
    );

    if (!isCollapsed) return button;
    return (
      <Tooltip title={itemLabel} placement="right">
        {button}
      </Tooltip>
    );
  };

  return (
    <Drawer
      open={open}
      onClose={isTemporary ? onClose : undefined}
      variant={variant}
      ModalProps={{ keepMounted: true }}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRadius: 0,
          borderRight: '1px solid',
          borderColor: 'divider',
          backgroundImage: 'linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)',
          boxShadow: isTemporary
            ? '0 20px 44px rgba(15, 23, 42, 0.18)'
            : '0 6px 24px rgba(15, 23, 42, 0.08)',
          overflowX: 'hidden',
          transition: (theme) =>
            theme.transitions.create(['width', 'box-shadow'], {
              duration: theme.transitions.duration.shorter,
              easing: theme.transitions.easing.easeOut,
            }),
        },
      }}
    >
      <Box component="nav" aria-label="Основная навигация" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Toolbar sx={{ minHeight: 72, px: isCollapsed ? 1.25 : 1.75 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
              width: '100%',
              minWidth: 0,
            }}
          >
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: '10px',
                display: 'grid',
                placeItems: 'center',
                fontWeight: 800,
                fontSize: '0.95rem',
                color: 'primary.contrastText',
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                flexShrink: 0,
              }}
              aria-hidden="true"
            >
              P
            </Box>

            {!isCollapsed && (
              <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 800, lineHeight: 1.1, letterSpacing: '0.01em' }}
                  noWrap
                >
                  PathwiseAI
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', fontSize: '0.72rem' }}
                  noWrap
                >
                  Ваш учебный маршрут
                </Typography>
              </Box>
            )}

            {!isTemporary && onToggleCollapsed && (
              <Tooltip title={isCollapsed ? 'Развернуть меню' : 'Свернуть меню'} placement="right">
                <IconButton
                  onClick={onToggleCollapsed}
                  aria-label={isCollapsed ? 'Развернуть меню' : 'Свернуть меню'}
                  size="small"
                  sx={{
                    ml: 'auto',
                    border: '1px solid',
                    borderColor: alpha('#64748b', 0.3),
                    backgroundColor: alpha('#ffffff', 0.8),
                    '&:hover': {
                      backgroundColor: '#ffffff',
                    },
                    '&:focus-visible': {
                      outline: '2px solid',
                      outlineColor: 'primary.main',
                      outlineOffset: 2,
                    },
                  }}
                >
                  {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Toolbar>

        <Divider />

        <Box sx={{ py: 1.25, display: 'flex', flexDirection: 'column', gap: 0.25 }}>
          {NAV_SECTIONS.map((section, index) => (
            <Box key={section.title}>
              {!isCollapsed && (
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    px: 2.75,
                    pb: 0.4,
                    pt: index === 0 ? 0.5 : 1.2,
                    color: 'text.disabled',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    fontSize: '0.68rem',
                  }}
                >
                  {section.title}
                </Typography>
              )}

              <List disablePadding sx={{ py: 0.2 }}>
                {section.items.map(renderLinkItem)}
              </List>
            </Box>
          ))}
        </Box>

        <Box sx={{ mt: 'auto' }}>
          <Divider />

          {currentUser && (
            <Box sx={{ px: isCollapsed ? 0 : 2, py: 1.6 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.25,
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                  px: isCollapsed ? 0 : 0.9,
                  py: 0.4,
                  borderRadius: 2,
                }}
              >
                <Tooltip
                  title={`${currentUser.username} • ${currentUser.role === 'admin' ? 'Админ' : 'Пользователь'}`}
                  placement="right"
                  disableHoverListener={!isCollapsed}
                >
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: 'secondary.main',
                      fontWeight: 700,
                    }}
                  >
                    {currentUser.username.charAt(0).toUpperCase()}
                  </Avatar>
                </Tooltip>

                {!isCollapsed && (
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 700, lineHeight: 1.2 }} noWrap>
                      {currentUser.username}
                    </Typography>
                    <Chip
                      label={currentUser.role === 'admin' ? 'Админ' : 'Пользователь'}
                      color={currentUser.role === 'admin' ? 'secondary' : 'default'}
                      size="small"
                      sx={{ mt: 0.4 }}
                    />
                  </Box>
                )}
              </Box>
            </Box>
          )}

          {!isCollapsed && (
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                px: 2.75,
                pb: 0.4,
                color: 'text.disabled',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontSize: '0.68rem',
              }}
            >
              Аккаунт
            </Typography>
          )}

          <List disablePadding sx={{ pt: 0.1, pb: 1.2 }}>
            {renderLinkItem(PROFILE_NAV_ITEM)}
            {renderLogoutItem()}
          </List>
        </Box>
      </Box>
    </Drawer>
  );
};
