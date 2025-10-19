import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';
import { AccessTime, PlayCircle, Schedule } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { lessonsApi } from '@shared/api/lessons/api';
import type { LessonForReview } from '@shared/api/lessons/types';
import { useCurrentUser } from '@shared/model/users';

interface ReviewLessonsListProps {
  maxItems?: number;
}

export const ReviewLessonsList: React.FC<ReviewLessonsListProps> = ({
  maxItems = 6,
}) => {
  const [lessons, setLessons] = useState<LessonForReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userId } = useCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLessons = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        setError(null);
        const lessonsData = await lessonsApi.getLessonsForReview(userId);
        setLessons(lessonsData.slice(0, maxItems));
      } catch (err) {
        console.error('Failed to fetch review lessons:', err);
        setError(
          err instanceof Error
            ? err.message
            : 'Не удалось загрузить уроки для повторения',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();

    // Слушаем событие обновления урока
    const handleLessonUpdate = () => {
      fetchLessons();
    };

    window.addEventListener('lessonUpdated', handleLessonUpdate);

    return () => {
      window.removeEventListener('lessonUpdated', handleLessonUpdate);
    };
  }, [userId, maxItems]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      return 'Сегодня';
    } else if (diffDays === 1) {
      return 'Завтра';
    } else if (diffDays <= 7) {
      return `Через ${diffDays} дн.`;
    } else {
      return date.toLocaleDateString('ru-RU');
    }
  };

  const getPriorityColor = (
    daysOverdue: number,
  ): 'error' | 'warning' | 'info' => {
    if (daysOverdue > 3) return 'error';
    if (daysOverdue > 0) return 'warning';
    return 'info';
  };

  const getPriorityText = (daysOverdue: number): string => {
    if (daysOverdue > 3) return 'Критично';
    if (daysOverdue > 0) return 'Важно';
    return 'Планово';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (lessons.length === 0) {
    return (
      <Box textAlign="center" p={3}>
        <Typography variant="body1" color="text.secondary">
          Нет уроков для повторения
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={2}>
      {lessons.map((lesson) => {
        const nextReviewDate = new Date(lesson.next_review_at);
        const now = new Date();
        const daysOverdue = Math.floor(
          (now.getTime() - nextReviewDate.getTime()) / (1000 * 60 * 60 * 24),
        );

        return (
          <Grid key={lesson.id} size={{ xs: 12, sm: 6, lg: 4 }}>
            <Card
              sx={{
                cursor: 'pointer',
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3,
                },
              }}
              onClick={() =>
                navigate(
                  `/courses/${lesson.unit.course.id}/lessons/${lesson.id}`,
                )
              }
            >
              <CardContent>
                <Stack spacing={2} height="100%">
                  <Typography variant="h6" component="h3" fontWeight={600}>
                    {lesson.title}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    {lesson.unit.course.title} • {lesson.unit.title}
                  </Typography>

                  <Box display="flex" alignItems="center" gap={1}>
                    <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      Следующее повторение: {formatDate(lesson.next_review_at)}
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" gap={1}>
                    <AccessTime
                      sx={{ fontSize: 16, color: 'text.secondary' }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      Интервал: {lesson.interval} дн.
                    </Typography>
                  </Box>

                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mt="auto"
                  >
                    <Chip
                      label={getPriorityText(daysOverdue)}
                      color={getPriorityColor(daysOverdue)}
                      size="small"
                    />

                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<PlayCircle />}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(
                          `/courses/${lesson.unit.course.id}/lessons/${lesson.id}`,
                        );
                      }}
                    >
                      Повторить
                    </Button>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};
