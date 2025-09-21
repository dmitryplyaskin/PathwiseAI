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
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack spacing={2} height="100%">
          <Typography variant="h4" component="h3">
            {lesson.title}
          </Typography>

          <Typography variant="body2" sx={{ flexGrow: 1 }}>
            {lesson.description}
          </Typography>

          <Box>
            <LinearProgress
              variant="determinate"
              value={lesson.progress}
              sx={{ mb: 1, height: 6 }}
            />
            <Typography variant="caption" color="text.secondary">
              Прогресс: {lesson.progress}%
            </Typography>
          </Box>

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="caption" color="text.secondary">
              {lesson.lastStudied}
            </Typography>

            <Chip
              icon={lesson.status === 'completed' ? <EmojiEvents /> : undefined}
              label={lesson.status === 'completed' ? 'Завершен' : 'В процессе'}
              color={lesson.status === 'completed' ? 'success' : 'info'}
              size="small"
            />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};
