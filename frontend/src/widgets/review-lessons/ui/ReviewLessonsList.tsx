import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';
import { useNavigate } from 'react-router';
import { lessonsApi } from '@shared/api/lessons/api';
import type { LessonForReview } from '@shared/api/lessons/types';
import { useCurrentUser } from '@shared/model/users';
import { LessonCard } from '@features/lesson-card/ui/LessonCard';

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

    void fetchLessons();

    // Слушаем событие обновления урока
    const handleLessonUpdate = () => {
      void fetchLessons();
    };

    window.addEventListener('lessonUpdated', handleLessonUpdate);

    return () => {
      window.removeEventListener('lessonUpdated', handleLessonUpdate);
    };
  }, [userId, maxItems]);

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

  const handleLessonClick = (lessonId: string, courseId: string) => {
    void navigate(`/courses/${courseId}/lessons/${lessonId}`);
  };

  return (
    <Grid container spacing={2}>
      {lessons.map((lesson) => (
        <Grid key={lesson.id} size={{ xs: 12, sm: 6, lg: 4 }}>
          <LessonCard
            lesson={lesson}
            variant="review"
            onClick={(l) => handleLessonClick(l.id, l.unit.course.id)}
            onAction={(l) => handleLessonClick(l.id, l.unit.course.id)}
          />
        </Grid>
      ))}
    </Grid>
  );
};
