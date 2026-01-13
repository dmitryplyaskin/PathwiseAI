import {
  Paper,
  Box,
  Typography,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import { AutoAwesome, MoreVert } from '@mui/icons-material';
import { MarkdownRenderer } from '@shared/ui';
import type { Message } from '../model/lesson_api';

interface MessageItemProps {
  message: Message;
  regeneratingMessageId: string | null;
  onOpenMessageMenu?: (
    messageId: string,
    event: React.MouseEvent<HTMLElement>,
  ) => void;
}

export const MessageItem = ({
  message,
  regeneratingMessageId,
  onOpenMessageMenu,
}: MessageItemProps) => {
  if (message.type === 'preloader') {
    return (
      <Paper
        elevation={0}
        variant="outlined"
        sx={{
          p: 3,
          bgcolor: 'background.paper',
          borderRadius: 3,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
            py: 2,
          }}
        >
          <CircularProgress size={22} thickness={4} />
          <Typography variant="body2" color="text.secondary">
            ИИ‑помощник думает…
          </Typography>
        </Box>
      </Paper>
    );
  }

  if (message.type === 'bot') {
    return (
      <Paper
        elevation={0}
        variant="outlined"
        sx={{
          p: 3,
          bgcolor: 'background.paper',
          borderRadius: 3,
          position: 'relative',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <AutoAwesome sx={{ color: 'primary.main', fontSize: 18 }} />
            <Typography variant="body2" fontWeight={700} color="text.primary">
              Ответ ИИ‑помощника
            </Typography>
            {regeneratingMessageId === message.id && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  ml: 1.5,
                }}
              >
                <CircularProgress size={14} thickness={4} />
                <Typography variant="caption" color="text.secondary">
                  Перегенерация…
                </Typography>
              </Box>
            )}
          </Box>
          {onOpenMessageMenu && (
            <Tooltip title="Действия">
              <IconButton
                size="small"
                disabled={regeneratingMessageId === message.id}
                onClick={(e) => onOpenMessageMenu(message.id, e)}
              >
                <MoreVert fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
        {regeneratingMessageId === message.id ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              py: 4,
              opacity: 0.6,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Генерируется новый ответ…
            </Typography>
          </Box>
        ) : (
          <MarkdownRenderer showLineNumbers={true} maxCodeHeight="500px">
            {message.content}
          </MarkdownRenderer>
        )}
      </Paper>
    );
  }

  // User message
  return (
    <Paper
      elevation={0}
      variant="outlined"
      sx={{
        p: 3,
        bgcolor: 'primary.50',
        borderRadius: 3,
      }}
    >
      <Box>
        <Typography
          variant="body2"
          fontWeight={700}
          color="text.primary"
          sx={{ mb: 1 }}
        >
          Ваш вопрос
        </Typography>
        <Typography sx={{ fontWeight: 500, color: 'text.primary' }}>
          {message.content}
        </Typography>
      </Box>
    </Paper>
  );
};
