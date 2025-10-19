import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Chip,
  Stack,
  CircularProgress,
  Alert,
} from '@mui/material';
import { MenuBook, AccessTime } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import type { Lesson } from '@shared/api/lessons/types';
import { LessonStatus } from '@shared/api/lessons/types';

interface LessonsListProps {
  lessons: Lesson[];
  loading: boolean;
  error: string | null;
}

const getStatusColor = (
  status: LessonStatus,
): 'default' | 'primary' | 'success' => {
  switch (status) {
    case LessonStatus.NOT_STARTED:
      return 'default';
    case LessonStatus.LEARNING:
      return 'primary';
    case LessonStatus.MASTERED:
      return 'success';
    default:
      return 'default';
  }
};

const getStatusText = (status: LessonStatus): string => {
  switch (status) {
    case LessonStatus.NOT_STARTED:
      return 'Не начат';
    case LessonStatus.LEARNING:
      return 'Изучается';
    case LessonStatus.MASTERED:
      return 'Освоен';
    default:
      return 'Неизвестно';
  }
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const LessonsList: React.FC<LessonsListProps> = ({
  lessons,
  loading,
  error,
}) => {
  const navigate = useNavigate();

  const handleLessonClick = (lesson: Lesson) => {
    const courseId = lesson.unit.course.id;
    const unitId = lesson.unit.id;
    const lessonId = lesson.id;

    // Используем маршрут с полной иерархией: courses/:id/units/:unitId/lessons/:lessonId
    navigate(`/courses/${courseId}/units/${unitId}/lessons/${lessonId}`);
  };
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        Ошибка загрузки уроков: {error}
      </Alert>
    );
  }

  if (lessons.length === 0) {
    return (
      <Alert severity="info" sx={{ mb: 3 }}>
        Уроки не найдены
      </Alert>
    );
  }

  return (
    <Grid container spacing={3}>
      {lessons.map((lesson) => (
        <Grid key={lesson.id} size={{ xs: 12, sm: 6, lg: 4 }}>
          <Card
            onClick={() => handleLessonClick(lesson)}
            sx={{
              cursor: 'pointer',
              height: '100%',
              transition:
                'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4,
              },
            }}
          >
            <CardContent>
              <Stack spacing={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  <MenuBook color="primary" />
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography variant="h6" component="h3" noWrap>
                      {lesson.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {lesson.unit.course.title} → {lesson.unit.title}
                    </Typography>
                  </Box>
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {lesson.description}
                </Typography>

                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Chip
                    label={getStatusText(lesson.status)}
                    color={getStatusColor(lesson.status)}
                    size="small"
                  />

                  <Box display="flex" alignItems="center" gap={0.5}>
                    <AccessTime fontSize="small" color="action" />
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(lesson.created_at)}
                    </Typography>
                  </Box>
                </Box>

                {lesson.last_reviewed_at && (
                  <Typography variant="caption" color="text.secondary">
                    Последний просмотр: {formatDate(lesson.last_reviewed_at)}
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
