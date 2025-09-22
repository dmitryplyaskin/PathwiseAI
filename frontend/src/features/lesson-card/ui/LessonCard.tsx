import {
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Chip,
  Box,
  Stack,
} from '@mui/material';
import { EmojiEvents } from '@mui/icons-material';
import type { FC } from 'react';
import type { Lesson } from '@/widgets/lessons-list/model/mock';

interface LessonCardProps {
  lesson: Lesson;
  handleLessonClick: (id: string) => void;
}

export const LessonCard: FC<LessonCardProps> = ({
  lesson,
  handleLessonClick,
}) => {
  return (
    <Card
      onClick={() => handleLessonClick(lesson.id)}
      sx={{
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Stack spacing={2} height="100%">
          <Typography variant="h4" component="h3" sx={{ fontWeight: 500 }}>
            {lesson.title}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              flexGrow: 1,
              lineHeight: 1.6,
            }}
          >
            {lesson.description}
          </Typography>

          <Box>
            <LinearProgress
              variant="determinate"
              value={lesson.progress}
              sx={{
                mb: 1,
                height: 8,
                borderRadius: 4,
                backgroundColor: 'action.hover',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                },
              }}
            />
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight={500}
            >
              Прогресс: {lesson.progress}%
            </Typography>
          </Box>

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={1}
          >
            <Typography variant="caption" color="text.secondary">
              {lesson.lastStudied === 'Never'
                ? 'Не изучался'
                : lesson.lastStudied}
            </Typography>

            <Chip
              icon={lesson.status === 'completed' ? <EmojiEvents /> : undefined}
              label={lesson.status === 'completed' ? 'Завершен' : 'В процессе'}
              color={lesson.status === 'completed' ? 'success' : 'info'}
              size="small"
              sx={{
                fontWeight: 500,
                '& .MuiChip-icon': {
                  fontSize: '16px',
                },
              }}
            />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};
