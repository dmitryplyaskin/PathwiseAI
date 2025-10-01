import {
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ChatBubbleOutline,
  ForkRight,
  CheckCircle,
  Delete,
} from '@mui/icons-material';
import type { Thread } from '../../../shared/api/lessons';

interface ThreadMenuProps {
  anchorEl: HTMLElement | null;
  currentThreadId: string;
  threads: Thread[];
  onClose: () => void;
  onSwitchThread: (threadId: string) => void;
  onDeleteThread: (threadId: string) => void;
}

export const ThreadMenu = ({
  anchorEl,
  currentThreadId,
  threads,
  onClose,
  onSwitchThread,
  onDeleteThread,
}: ThreadMenuProps) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      PaperProps={{
        sx: { minWidth: 250, borderRadius: 2 },
      }}
    >
      <MenuItem disabled sx={{ opacity: '1 !important', fontWeight: 600 }}>
        Доступные ветки разговоров
      </MenuItem>
      <Divider />
      <MenuItem
        onClick={() => onSwitchThread('main')}
        selected={currentThreadId === 'main'}
      >
        <ListItemIcon>
          {currentThreadId === 'main' ? (
            <CheckCircle fontSize="small" color="primary" />
          ) : (
            <ChatBubbleOutline fontSize="small" />
          )}
        </ListItemIcon>
        <ListItemText>Основная ветка</ListItemText>
      </MenuItem>
      {threads
        .filter((t: Thread) => t.threadId !== 'main')
        .map((thread: Thread, index: number) => (
          <MenuItem
            key={thread.threadId}
            onClick={() => onSwitchThread(thread.threadId)}
            selected={currentThreadId === thread.threadId}
          >
            <ListItemIcon>
              {currentThreadId === thread.threadId ? (
                <CheckCircle fontSize="small" color="primary" />
              ) : (
                <ForkRight fontSize="small" />
              )}
            </ListItemIcon>
            <ListItemText
              primary={`Ветка ${index + 1}`}
              secondary={`${thread.messageCount} сообщений`}
            />
            <Tooltip title="Удалить ветку">
              <IconButton
                size="small"
                color="error"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteThread(thread.threadId);
                }}
                sx={{
                  '&:hover': {
                    backgroundColor: 'error.light',
                    color: 'white',
                  },
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Tooltip>
          </MenuItem>
        ))}
    </Menu>
  );
};
