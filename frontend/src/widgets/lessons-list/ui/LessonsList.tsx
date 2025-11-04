import React from 'react';
import {
  Box,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router';
import type { Lesson } from '@shared/api/lessons/types';
import { LessonCard } from '@features/lesson-card/ui/LessonCard';

interface LessonsListProps {
  lessons: Lesson[];
  loading: boolean;
  error: string | null;
}

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
          <LessonCard
            lesson={lesson}
            variant="default"
            onClick={() => handleLessonClick(lesson)}
          />
        </Grid>
      ))}
    </Grid>
  );
};
