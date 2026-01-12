import React from 'react';
import { Link, useLocation } from 'react-router';
import { useUnit } from 'effector-react';
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Home as HomeIcon,
  School as SchoolIcon,
  Quiz as QuizIcon,
  AccessTime as AccessTimeIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { $currentUser, logoutRequested } from '@shared/model/auth';

export const DRAWER_WIDTH = 280;
export const DRAWER_COLLAPSED_WIDTH = 72;

type NavItem = {
  label: string;
  to: string;
  icon: React.ReactNode;
  match?: 'exact' | 'prefix';
};

const NAV_ITEMS: NavItem[] = [
  { label: 'Главная', to: '/', icon: <HomeIcon />, match: 'exact' },
  { label: 'Курсы', to: '/courses', icon: <SchoolIcon />, match: 'prefix' },
  {
    label: 'История тестов',
    to: '/test-history',
    icon: <QuizIcon />,
    match: 'exact',
  },
  {
    label: 'Повторение',
    to: '/review',
    icon: <AccessTimeIcon />,
    match: 'exact',
  },
];

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

  const handleLogout = () => {
    logoutRequested();
    if (isTemporary) onClose();
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
          // Drawer использует Paper внутри; в проектной теме Paper глобально скруглён.
          // Для SaaS-меню чаще ожидается прямой край.
          borderRadius: 0,
        },
      }}
    >
      <Toolbar sx={{ px: 1.5, display: 'flex', alignItems: 'center' }}>
        {!isCollapsed && (
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, flexGrow: 1, whiteSpace: 'nowrap' }}
          >
            PathwiseAI
          </Typography>
        )}

        {!isTemporary && onToggleCollapsed && (
          <Tooltip title={isCollapsed ? 'Развернуть меню' : 'Свернуть меню'}>
            <IconButton
              onClick={onToggleCollapsed}
              aria-label={isCollapsed ? 'Развернуть меню' : 'Свернуть меню'}
              size="small"
              sx={{ ml: 'auto' }}
            >
              {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </Tooltip>
        )}
      </Toolbar>

      <Divider />

      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <List sx={{ px: 1, py: 1 }}>
          {NAV_ITEMS.map((item) => {
            const button = (
              <ListItemButton
                key={item.to}
                component={Link}
                to={item.to}
                onClick={isTemporary ? onClose : undefined}
                selected={isSelected(item)}
                sx={{
                  borderRadius: 2,
                  mx: 1,
                  ...(isCollapsed
                    ? {
                        px: 1,
                        justifyContent: 'center',
                      }
                    : null),
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: isCollapsed ? 'auto' : 40,
                    ...(isCollapsed ? { justifyContent: 'center' } : null),
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {!isCollapsed && (
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: 600,
                      fontSize: '0.95rem',
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
          })}
        </List>

        <Box sx={{ mt: 'auto' }}>
          <Divider />

          {currentUser && (
            <Box sx={{ px: isCollapsed ? 0 : 2, py: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  ...(isCollapsed ? { justifyContent: 'center' } : null),
                }}
              >
                <Tooltip
                  title={`${currentUser.username} • ${currentUser.role === 'admin' ? 'Админ' : 'Пользователь'}`}
                  placement="right"
                  disableHoverListener={!isCollapsed}
                >
                  <Avatar sx={{ width: 36, height: 36, bgcolor: 'secondary.main' }}>
                    {currentUser.username.charAt(0).toUpperCase()}
                  </Avatar>
                </Tooltip>

                {!isCollapsed && (
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 700 }} noWrap>
                      {currentUser.username}
                    </Typography>
                    <Chip
                      label={currentUser.role === 'admin' ? 'Админ' : 'Пользователь'}
                      color={currentUser.role === 'admin' ? 'secondary' : 'default'}
                      size="small"
                      sx={{ mt: 0.5 }}
                    />
                  </Box>
                )}
              </Box>
            </Box>
          )}

          <List sx={{ px: 1, pb: 1 }}>
            {(() => {
              const itemLabel = 'Профиль';
              const button = (
                <ListItemButton
                  component={Link}
                  to="/profile"
                  onClick={isTemporary ? onClose : undefined}
                  selected={location.pathname === '/profile'}
                  sx={{
                    borderRadius: 2,
                    mx: 1,
                    ...(isCollapsed ? { px: 1, justifyContent: 'center' } : null),
                  }}
                >
                  <ListItemIcon sx={{ minWidth: isCollapsed ? 'auto' : 40 }}>
                    <PersonIcon />
                  </ListItemIcon>
                  {!isCollapsed && (
                    <ListItemText
                      primary={itemLabel}
                      primaryTypographyProps={{ fontWeight: 600, fontSize: '0.95rem' }}
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
            })()}

            {(() => {
              const itemLabel = 'Выйти';
              const button = (
                <ListItemButton
                  onClick={handleLogout}
                  sx={{
                    borderRadius: 2,
                    mx: 1,
                    ...(isCollapsed ? { px: 1, justifyContent: 'center' } : null),
                  }}
                >
                  <ListItemIcon sx={{ minWidth: isCollapsed ? 'auto' : 40 }}>
                    <LogoutIcon color="error" />
                  </ListItemIcon>
                  {!isCollapsed && (
                    <ListItemText
                      primary={itemLabel}
                      primaryTypographyProps={{ fontWeight: 600, fontSize: '0.95rem' }}
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
            })()}
          </List>
        </Box>
      </Box>
    </Drawer>
  );
};

