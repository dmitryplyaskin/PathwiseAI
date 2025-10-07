import { useState } from 'react';
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  ExpandMore,
  Refresh,
  SwapHoriz,
  Add,
  Edit,
  Delete,
} from '@mui/icons-material';
import type { Lesson } from '../../../shared/api/lessons/types';

interface LessonManagementMenuProps {
  lesson: Lesson | null;
  onDeleteLesson: () => void;
}

export const LessonManagementMenu: React.FC<LessonManagementMenuProps> = ({
  lesson,
  onDeleteLesson,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (action: string) => {
    console.log(`Выполняется действие: ${action}`);
    handleClose();
  };

  const handleDeleteClick = () => {
    onDeleteLesson();
    handleClose();
  };

  return (
    <>
      <Button
        variant="outlined"
        fullWidth
        endIcon={<ExpandMore />}
        onClick={handleClick}
        sx={{
          py: 1,
          borderRadius: 2,
          fontWeight: 500,
          borderColor: 'primary.200',
          color: 'text.secondary',
          '&:hover': {
            borderColor: 'primary.main',
            color: 'primary.main',
            backgroundColor: 'primary.50',
          },
        }}
      >
        Дополнительно
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
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
          onClick={() => handleMenuItemClick('reset-progress')}
          sx={{
            py: 1.5,
            px: 2,
            '&:hover': {
              backgroundColor: 'primary.50',
            },
          }}
        >
          <ListItemIcon>
            <Refresh sx={{ fontSize: 20, color: 'primary.main' }} />
          </ListItemIcon>
          <ListItemText
            primary="Сбросить прохождение"
            primaryTypographyProps={{
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
          />
        </MenuItem>

        <MenuItem
          onClick={() => handleMenuItemClick('change-course')}
          sx={{
            py: 1.5,
            px: 2,
            '&:hover': {
              backgroundColor: 'primary.50',
            },
          }}
        >
          <ListItemIcon>
            <SwapHoriz sx={{ fontSize: 20, color: 'primary.main' }} />
          </ListItemIcon>
          <ListItemText
            primary="Поменять курс"
            primaryTypographyProps={{
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
          />
        </MenuItem>

        <MenuItem
          onClick={() => handleMenuItemClick('manage-unit')}
          sx={{
            py: 1.5,
            px: 2,
            '&:hover': {
              backgroundColor: 'primary.50',
            },
          }}
        >
          <ListItemIcon>
            <Add sx={{ fontSize: 20, color: 'primary.main' }} />
          </ListItemIcon>
          <ListItemText
            primary="Добавить/изменить юнит"
            primaryTypographyProps={{
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
          />
        </MenuItem>

        <Divider sx={{ my: 0.5 }} />

        <MenuItem
          onClick={handleDeleteClick}
          disabled={!lesson}
          sx={{
            py: 1.5,
            px: 2,
            '&:hover': {
              backgroundColor: 'error.50',
            },
          }}
        >
          <ListItemIcon>
            <Delete sx={{ fontSize: 20, color: 'error.main' }} />
          </ListItemIcon>
          <ListItemText
            primary="Удалить урок"
            primaryTypographyProps={{
              fontSize: '0.875rem',
              fontWeight: 500,
              color: 'error.main',
            }}
          />
        </MenuItem>
      </Menu>
    </>
  );
};
