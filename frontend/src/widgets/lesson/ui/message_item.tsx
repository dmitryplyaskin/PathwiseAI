import {
  Paper,
  Box,
  Typography,
  CircularProgress,
  IconButton,
  Tooltip,
  Fade,
} from '@mui/material';
import { AutoAwesome, MoreVert } from '@mui/icons-material';
import { MarkdownRenderer } from '../../../shared/ui';
import type { Message } from '../model/lesson_api';

interface MessageItemProps {
  message: Message;
  index: number;
  regeneratingMessageId: string | null;
  onOpenMessageMenu?: (
    messageId: string,
    event: React.MouseEvent<HTMLElement>,
  ) => void;
}

export const MessageItem = ({
  message,
  index,
  regeneratingMessageId,
  onOpenMessageMenu,
}: MessageItemProps) => {
  if (message.type === 'preloader') {
    return (
      <Fade in key={message.id} timeout={300 + index * 100}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            bgcolor: 'background.paper',
            border: '2px solid',
            borderColor: 'divider',
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
            <CircularProgress size={24} thickness={4} />
            <Typography variant="body2" color="text.secondary">
              ИИ-помощник думает...
            </Typography>
          </Box>
        </Paper>
      </Fade>
    );
  }

  if (message.type === 'bot') {
    return (
      <Fade in key={message.id} timeout={300 + index * 100}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            bgcolor: 'background.paper',
            border: '2px solid',
            borderColor: 'divider',
            borderRadius: 3,
            transition: 'all 0.3s ease',
            position: 'relative',
            '&:hover': {
              borderColor: 'primary.100',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 24px rgba(59, 130, 246, 0.12)',
            },
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
              <AutoAwesome sx={{ color: 'primary.main', fontSize: 20 }} />
              <Typography
                variant="caption"
                fontWeight={600}
                color="primary.main"
                sx={{
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                }}
              >
                Ответ ИИ-помощника
              </Typography>
              {regeneratingMessageId === message.id && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    ml: 2,
                  }}
                >
                  <CircularProgress size={16} thickness={4} />
                  <Typography variant="caption" color="text.secondary">
                    Перегенерация...
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
                Генерируется новый ответ...
              </Typography>
            </Box>
          ) : (
            <MarkdownRenderer showLineNumbers={true} maxCodeHeight="500px">
              {message.content}
            </MarkdownRenderer>
          )}
        </Paper>
      </Fade>
    );
  }

  // User message
  return (
    <Fade in key={message.id} timeout={300 + index * 100}>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          bgcolor: 'primary.50',
          border: '2px solid',
          borderColor: 'primary.200',
          borderRadius: 3,
          transition: 'all 0.3s ease',
          position: 'relative',
          '&:hover': {
            borderColor: 'primary.main',
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 24px rgba(59, 130, 246, 0.12)',
          },
        }}
      >
        <Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 2,
            }}
          >
            <Typography
              variant="caption"
              fontWeight={600}
              color="primary.main"
              sx={{
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
            >
              Ваш вопрос
            </Typography>
          </Box>
          <Typography sx={{ fontWeight: 500, color: 'text.primary' }}>
            {message.content}
          </Typography>
        </Box>
      </Paper>
    </Fade>
  );
};
