import { Box, Container, Typography, Stack, Chip, Fade } from '@mui/material';
import { Info } from '@mui/icons-material';
import type { Lesson } from '@shared/api/lessons';

interface LessonHeaderProps {
  lesson: Lesson | null;
  notFound: boolean;
  lessonTitle: string;
}

export const LessonHeader = ({
  lesson,
  notFound,
  lessonTitle,
}: LessonHeaderProps) => {
  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
        color: 'white',
        py: { xs: 3, md: 4 },
        px: { xs: 2, md: 3 },
        position: 'relative',
        overflow: 'hidden',
        // Меньше декоративных слоёв — меньше визуального шума и “гигантизма”.
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={1.5} alignItems="center" sx={{ position: 'relative' }}>
          {notFound && (
            <Fade in>
              <Chip
                icon={<Info sx={{ color: 'white !important' }} />}
                label="Демо-режим"
                size="small"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontWeight: 500,
                  backdropFilter: 'blur(10px)',
                }}
              />
            </Fade>
          )}
          <Typography
            variant="h1Solid"
            component="h1"
            color="white"
            sx={{
              fontSize: { xs: '1.6rem', md: '2.1rem' },
              fontWeight: 700,
              textAlign: 'center',
              textShadow: '0 1px 6px rgba(0,0,0,0.10)',
            }}
          >
            {lessonTitle}
          </Typography>
          <Typography
            variant="body2"
            color="white"
            sx={{
              textAlign: 'center',
              maxWidth: 760,
              opacity: 0.92,
            }}
          >
            {lesson
              ? lesson.description ||
                'Интерактивный урок с поддержкой ИИ-помощника для персонализированного обучения'
              : 'Демо-версия урока · Данные отсутствуют в базе'}
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
};
