import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Alert,
} from '@mui/material';
import { Warning } from '@mui/icons-material';

interface ConfirmCloseDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmCloseDialog = ({
  open,
  onClose,
  onConfirm,
}: ConfirmCloseDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <Warning color="warning" />
          <Box component="span">Подтверждение закрытия</Box>
        </Box>
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          Вы уверены, что хотите закрыть тест сейчас?
        </DialogContentText>
        <Alert severity="warning" sx={{ borderRadius: 2 }}>
          Если вы закроете тест сейчас, прохождение не будет засчитано. Все
          ваши ответы будут потеряны, и вам придется начать тест заново.
        </Alert>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={onClose} variant="outlined" color="inherit">
          Отмена
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          autoFocus
        >
          Закрыть без сохранения
        </Button>
      </DialogActions>
    </Dialog>
  );
};

