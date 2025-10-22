import React, { useState } from 'react';
import { Link } from 'react-router';
import { useUnit } from 'effector-react';
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Chip,
} from '@mui/material';
import { Quiz, AccessTime, Logout } from '@mui/icons-material';
import { $currentUser, logoutRequested } from '@shared/model/auth';

export const UserMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const currentUser = useUnit($currentUser);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logoutRequested();
    handleClose();
  };

  if (!currentUser) {
    return null;
  }

  return (
    <>
      <Button
        onClick={handleClick}
        startIcon={
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
            {currentUser.username.charAt(0).toUpperCase()}
          </Avatar>
        }
        endIcon={
          <Chip
            label={currentUser.role === 'admin' ? 'Админ' : 'Пользователь'}
            color={currentUser.role === 'admin' ? 'secondary' : 'default'}
            size="small"
            sx={{ ml: 1 }}
          />
        }
        sx={{
          color: 'inherit',
          textTransform: 'none',
          fontWeight: 500,
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        }}
      >
        {currentUser.username}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
            borderRadius: 2,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
            border: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        <MenuItem
          component={Link}
          to="/test-history"
          onClick={handleClose}
          sx={{
            py: 1.5,
            px: 2,
            '&:hover': {
              backgroundColor: 'primary.50',
            },
          }}
        >
          <ListItemIcon>
            <Quiz fontSize="small" color="primary" />
          </ListItemIcon>
          <ListItemText
            primary="История тестов"
            primaryTypographyProps={{
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
          />
        </MenuItem>

        <MenuItem
          component={Link}
          to="/review"
          onClick={handleClose}
          sx={{
            py: 1.5,
            px: 2,
            '&:hover': {
              backgroundColor: 'primary.50',
            },
          }}
        >
          <ListItemIcon>
            <AccessTime fontSize="small" color="primary" />
          </ListItemIcon>
          <ListItemText
            primary="Повторение"
            primaryTypographyProps={{
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
          />
        </MenuItem>

        <MenuItem
          onClick={handleLogout}
          sx={{
            py: 1.5,
            px: 2,
            '&:hover': {
              backgroundColor: 'error.50',
            },
          }}
        >
          <ListItemIcon>
            <Logout fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText
            primary="Выйти"
            primaryTypographyProps={{
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
          />
        </MenuItem>
      </Menu>
    </>
  );
};
