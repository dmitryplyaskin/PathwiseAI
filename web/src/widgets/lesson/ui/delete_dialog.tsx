import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from '@mui/material';

interface DeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteDialog = ({
  open,
  onClose,
  onConfirm,
}: DeleteDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { borderRadius: 3, minWidth: 400 },
      }}
    >
      <DialogTitle sx={{ fontWeight: 600 }}>Удалить ветку?</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary">
          Вы уверены, что хотите удалить эту ветку разговора? Все сообщения в
          ней будут удалены без возможности восстановления.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onClose} sx={{ borderRadius: 2 }}>
          Отмена
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          sx={{ borderRadius: 2 }}
        >
          Удалить
        </Button>
      </DialogActions>
    </Dialog>
  );
};
