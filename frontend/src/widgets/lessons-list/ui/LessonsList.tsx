import { Box, Button, Container, Grid, Stack, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router';
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={4}>
        <Box>
          <Typography variant="h2" component="h1" gutterBottom>
            Lessons in Machine Learning
          </Typography>
          <Typography variant="h6" color="text.secondary">
            This unit covers the fundamental concepts of Machine Learning, from
            basic algorithms to neural networks. Each lesson is designed to
            build upon the last, providing a comprehensive learning path.
          </Typography>
        </Box>

        <Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h4" component="h2">
              Last Studied
            </Typography>
            <Button variant="text">View all studied lessons</Button>
          </Box>
          <Grid container spacing={3}>
            {lastStudiedLessons.map((lesson) => (
              <Grid item xs={12} sm={6} md={4} key={lesson.id}>
                <LessonCard
                  lesson={lesson}
                  handleLessonClick={handleLessonClick}
                />
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box>
          <Typography variant="h4" component="h2" mb={2}>
            All Lessons
          </Typography>
          <Stack spacing={3}>
            {mockLessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                handleLessonClick={handleLessonClick}
              />
            ))}
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
};
