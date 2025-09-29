import {
  Box,
  Button,
  Paper,
  Typography,
  Stack,
  Divider,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  Quiz,
  Schedule,
  DateRange,
  AutoAwesome,
  CheckCircle,
  PlayCircle,
  Info,
} from '@mui/icons-material';
import type { Lesson } from '../../../shared/api/lessons';

interface StickyInfoBlockProps {
  lesson: Lesson | null;
  notFound: boolean;
}

const formatDate = (dateString?: string) => {
  if (!dateString) return 'Не указана';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

const getStatusInfo = (status: string) => {
  const statuses = {
    not_started: {
      label: 'Не начат',
      color: 'default' as const,
      icon: <PlayCircle sx={{ fontSize: 18 }} />,
    },
    learning: {
      label: 'В изучении',
      color: 'primary' as const,
      icon: <AutoAwesome sx={{ fontSize: 18 }} />,
    },
    mastered: {
      label: 'Освоен',
      color: 'success' as const,
      icon: <CheckCircle sx={{ fontSize: 18 }} />,
    },
  };
  return statuses[status] || statuses.not_started;
};

export const StickyInfoBlock = ({ lesson, notFound }: StickyInfoBlockProps) => {
  const statusInfo = lesson
    ? getStatusInfo(lesson.status)
    : getStatusInfo('not_started');

  return (
    <Box
      component={Paper}
      elevation={0}
      sx={{
        position: 'sticky',
        top: '20px',
        p: 3,
        width: '300px',
        flexShrink: 0,
        alignSelf: 'flex-start',
        border: '2px solid',
        borderColor: 'primary.100',
        borderRadius: 3,
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fbff 100%)',
        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.08)',
      }}
    >
      <Stack spacing={3}>
        {/* Заголовок */}
        <Box>
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{
              background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 0.5,
            }}
          >
            Информация
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Детали урока
          </Typography>
        </Box>

        <Divider />

        {/* Статус */}
        <Stack spacing={1.5}>
          <Typography variant="body2" fontWeight={600} color="text.primary">
            Статус прохождения
          </Typography>
          <Chip
            icon={statusInfo.icon}
            label={statusInfo.label}
            color={statusInfo.color}
            size="medium"
            sx={{
              alignSelf: 'flex-start',
              fontWeight: 600,
              px: 1,
              borderRadius: 2,
            }}
          />
          {lesson && lesson.status === 'learning' && (
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mb: 0.5,
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Прогресс
                </Typography>
                <Typography
                  variant="caption"
                  fontWeight={600}
                  color="primary.main"
                >
                  65%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={65}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: 'primary.50',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 3,
                  },
                }}
              />
            </Box>
          )}
        </Stack>

        <Divider />

        {/* Даты */}
        <Stack spacing={2}>
          <Box>
            <Box display="flex" alignItems="center" gap={1} mb={0.5}>
              <DateRange sx={{ fontSize: 18, color: 'primary.main' }} />
              <Typography
                variant="caption"
                fontWeight={600}
                color="text.primary"
              >
                Дата создания
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ pl: 3 }}>
              {lesson ? formatDate(lesson.created_at) : 'Не указана'}
            </Typography>
          </Box>

          {lesson && lesson.last_reviewed_at && (
            <Box>
              <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                <Schedule sx={{ fontSize: 18, color: 'primary.main' }} />
                <Typography
                  variant="caption"
                  fontWeight={600}
                  color="text.primary"
                >
                  Последнее изучение
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ pl: 3 }}>
                {formatDate(lesson.last_reviewed_at)}
              </Typography>
            </Box>
          )}

          {lesson && lesson.next_review_at && (
            <Box>
              <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                <Schedule sx={{ fontSize: 18, color: 'success.main' }} />
                <Typography
                  variant="caption"
                  fontWeight={600}
                  color="text.primary"
                >
                  Следующее повторение
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ pl: 3 }}>
                {formatDate(lesson.next_review_at)}
              </Typography>
            </Box>
          )}
        </Stack>

        {/* Информация о порядке */}
        {lesson && (
          <>
            <Divider />
            <Box>
              <Typography
                variant="caption"
                fontWeight={600}
                color="text.primary"
                display="block"
                mb={1}
              >
                Позиция в курсе
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: 'primary.50',
                }}
              >
                <Typography variant="h4" fontWeight={700} color="primary.main">
                  #{lesson.order}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  урок
                </Typography>
              </Box>
            </Box>
          </>
        )}

        {notFound && (
          <>
            <Divider />
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: 'info.50',
                border: '1px solid',
                borderColor: 'info.200',
              }}
            >
              <Box display="flex" alignItems="flex-start" gap={1}>
                <Info sx={{ fontSize: 18, color: 'info.main', mt: 0.2 }} />
                <Typography variant="caption" color="info.main">
                  Это демо-урок. Данные показаны для примера.
                </Typography>
              </Box>
            </Box>
          </>
        )}

        <Divider />

        {/* Кнопка теста */}
        <Button
          variant="contained"
          fullWidth
          startIcon={<Quiz />}
          disabled={notFound}
          sx={{
            py: 1.5,
            borderRadius: 2,
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25)',
            '&:hover': {
              boxShadow: '0 6px 16px rgba(59, 130, 246, 0.35)',
            },
          }}
        >
          Пройти тест
        </Button>

        {lesson && (
          <Typography
            variant="caption"
            color="text.secondary"
            textAlign="center"
          >
            Интервал повторения: {lesson.interval} дней
          </Typography>
        )}
      </Stack>
    </Box>
  );
};
