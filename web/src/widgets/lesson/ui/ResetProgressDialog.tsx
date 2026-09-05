import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import { Warning, Refresh } from '@mui/icons-material';

interface ResetProgressDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  lessonTitle?: string;
  isLoading?: boolean;
  error?: string | null;
}

export const ResetProgressDialog: React.FC<ResetProgressDialogProps> = ({
  open,
  onClose,
  onConfirm,
  lessonTitle,
  isLoading = false,
  error = null,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <Warning color="error" />
          <Typography variant="h6" fontWeight={600}>
            Подтверждение сброса прогресса
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ pt: 1 }}>
          <Typography variant="body1" color="text.primary" paragraph>
            Вы уверены, что хотите сбросить весь прогресс по уроку
            {lessonTitle && (
              <Typography
                component="span"
                fontWeight={600}
                color="primary.main"
              >
                {' '}
                "{lessonTitle}"{' '}
              </Typography>
            )}
            ?
          </Typography>

          <Alert severity="warning" sx={{ mt: 2 }}>
            <Typography variant="body2">
              Это действие нельзя отменить. Все результаты тестов и прогресс
              прохождения будут безвозвратно удалены. Урок останется, но его
              статус будет сброшен на "Не начат".
            </Typography>
          </Alert>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button
          onClick={onClose}
          disabled={isLoading}
          variant="outlined"
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1,
            fontWeight: 500,
          }}
        >
          Отмена
        </Button>
        <Button
          onClick={onConfirm}
          disabled={isLoading}
          variant="contained"
          color="error"
          startIcon={isLoading ? null : <Refresh />}
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1,
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(211, 47, 47, 0.25)',
            '&:hover': {
              boxShadow: '0 6px 16px rgba(211, 47, 47, 0.35)',
            },
          }}
        >
          {isLoading ? 'Сброс...' : 'Сбросить прогресс'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};


