import {
  Dialog,
  DialogContent,
  Stack,
  CircularProgress,
  Typography,
} from '@mui/material';
import type { TabType } from './types';

interface CreationLoadingDialogProps {
  open: boolean;
  activeTab: TabType;
}

export const CreationLoadingDialog = ({
  open,
  activeTab,
}: CreationLoadingDialogProps) => {
  return (
    <Dialog
      open={open}
      PaperProps={{
        sx: {
          p: 4,
          borderRadius: 3,
          textAlign: 'center',
          minWidth: 320,
        },
      }}
    >
      <DialogContent>
        <Stack spacing={3} alignItems="center">
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" fontWeight={600}>
            Создаем {activeTab === 'lesson' ? 'урок' : 'курс'}...
          </Typography>
          <Typography variant="body2" color="text.secondary">
            AI генерирует персонализированный контент
            <br />
            для вашего {activeTab === 'lesson' ? 'урока' : 'курса'}. Это займет
            несколько секунд.
          </Typography>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
