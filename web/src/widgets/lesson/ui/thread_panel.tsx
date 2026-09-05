import {
  Paper,
  Box,
  Typography,
  Chip,
  Tooltip,
  Button,
  IconButton,
  Badge,
} from '@mui/material';
import { ChatBubbleOutline, ForkRight, MoreVert } from '@mui/icons-material';
import type { Thread } from '@shared/api/lessons';

interface ThreadPanelProps {
  currentThreadId: string;
  threads: Thread[];
  onCreateNewThread: () => void;
  onOpenThreadMenu: (event: React.MouseEvent<HTMLElement>) => void;
}

export const ThreadPanel = ({
  currentThreadId,
  threads,
  onCreateNewThread,
  onOpenThreadMenu,
}: ThreadPanelProps) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 3,
        border: '2px solid',
        borderColor: 'primary.100',
        borderRadius: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <ChatBubbleOutline sx={{ color: 'primary.main' }} />
        <Typography variant="body2" fontWeight={600}>
          Текущая ветка:{' '}
          <Chip
            label={
              currentThreadId === 'main'
                ? 'Основная'
                : `Ветка ${threads.findIndex((t) => t.threadId === currentThreadId) + 1}`
            }
            size="small"
            color="primary"
            sx={{ ml: 1 }}
          />
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Tooltip title="Создать новую ветку">
          <Button
            variant="outlined"
            size="small"
            startIcon={<ForkRight />}
            onClick={onCreateNewThread}
            sx={{ borderRadius: 2 }}
          >
            Новая ветка
          </Button>
        </Tooltip>
        {threads.length > 0 && (
          <Tooltip title="Переключить ветку">
            <Badge badgeContent={threads.length} color="primary">
              <IconButton size="small" onClick={onOpenThreadMenu}>
                <MoreVert />
              </IconButton>
            </Badge>
          </Tooltip>
        )}
      </Box>
    </Paper>
  );
};
