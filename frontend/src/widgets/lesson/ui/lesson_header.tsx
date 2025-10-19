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
        py: 6,
        px: 3,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'radial-gradient(circle at 20% 50%, rgba(96, 165, 250, 0.3) 0%, transparent 50%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={2} alignItems="center" sx={{ position: 'relative' }}>
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
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 700,
              textAlign: 'center',
              textShadow: '0 2px 10px rgba(0,0,0,0.1)',
            }}
          >
            {lessonTitle}
          </Typography>
          <Typography
            variant="body1"
            color="white"
            sx={{
              textAlign: 'center',
              maxWidth: '700px',
              opacity: 0.95,
              fontSize: '1.1rem',
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
