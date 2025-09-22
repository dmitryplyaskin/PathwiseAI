import {
  Box,
  Button,
  Container,
  Grid,
  Stack,
  Typography,
  AppBar,
  Toolbar,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router';
import { MenuBook, AccessTime } from '@mui/icons-material';
import { LessonCard } from '../../../features/lesson-card/ui/LessonCard';
import { mockLessons } from '../model/mock';

export const LessonsList = () => {
  const navigate = useNavigate();
  const params = useParams();

  const handleLessonClick = (lessonId: string) => {
    navigate(
      `/courses/${params.id}/units/${params.unitId}/lessons/${lessonId}`,
    );
  };

  const lastStudiedLessons = mockLessons.slice(0, 3);

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Заголовок */}
      <AppBar position="static" elevation={0}>
        <Toolbar sx={{ flexDirection: 'column', py: 6 }}>
          <Typography variant="h1" component="h1" gutterBottom>
            Уроки по машинному обучению
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            maxWidth="800px"
          >
            Этот раздел охватывает фундаментальные концепции машинного обучения,
            от базовых алгоритмов до нейронных сетей. Каждый урок создан для
            последовательного изучения материала.
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={6}>
          {/* Последние изученные уроки */}
          <Stack spacing={3}>
            <Box display="flex" alignItems="center" gap={1}>
              <AccessTime color="primary" />
              <Typography variant="h2">Недавно изученные</Typography>
            </Box>

            <Grid container spacing={3}>
              {lastStudiedLessons.map((lesson) => (
                <Grid key={lesson.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                  <LessonCard
                    lesson={lesson}
                    handleLessonClick={handleLessonClick}
                  />
                </Grid>
              ))}
            </Grid>
          </Stack>

          {/* Все уроки */}
          <Stack spacing={3}>
            <Box
              display="flex"
              alignItems="center"
              gap={1}
              justifyContent="space-between"
            >
              <Box display="flex" alignItems="center" gap={1}>
                <MenuBook color="primary" />
                <Typography variant="h2">Все уроки</Typography>
              </Box>
              <Button variant="text" color="primary">
                Показать изученные
              </Button>
            </Box>

            <Grid container spacing={3}>
              {mockLessons.map((lesson) => (
                <Grid key={lesson.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                  <LessonCard
                    lesson={lesson}
                    handleLessonClick={handleLessonClick}
                  />
                </Grid>
              ))}
            </Grid>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};
