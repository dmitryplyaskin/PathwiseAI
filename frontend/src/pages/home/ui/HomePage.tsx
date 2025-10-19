import { useState, useEffect } from 'react';
import {
  Container,
  Button,
  Typography,
  Box,
  Stack,
  AppBar,
  Toolbar,
} from '@mui/material';
import { Add, MenuBook, AccessTime } from '@mui/icons-material';
import { ContentCreationModal } from '@features/education-module/ui';
import { LessonsList } from '@widgets/lessons-list';
import { ReviewLessonsList } from '@widgets/review-lessons';
import { lessonsApi } from '@shared/api/lessons/api';
import type { Lesson } from '@shared/api/lessons/types';

export const HomePage = () => {
  const [isNewModuleModalOpen, setIsNewModuleModalOpen] = useState(false);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [lessonsLoading, setLessonsLoading] = useState(true);
  const [lessonsError, setLessonsError] = useState<string | null>(null);

  const handleNewModule = () => {
    setIsNewModuleModalOpen(true);
  };

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setLessonsLoading(true);
        setLessonsError(null);
        const lessonsData = await lessonsApi.getAllLessons();
        setLessons(lessonsData);
      } catch (error) {
        setLessonsError(
          error instanceof Error ? error.message : 'Ошибка загрузки уроков',
        );
      } finally {
        setLessonsLoading(false);
      }
    };

    void fetchLessons();
  }, []);

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Заголовок */}
      <AppBar position="static" elevation={0}>
        <Toolbar sx={{ flexDirection: 'column', py: 6 }}>
          <Typography variant="h1" component="h1" gutterBottom>
            PathwiseAI
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Персональная система обучения с искусственным интеллектом
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Секция создания нового модуля */}
        <Box display="flex" justifyContent="center" mb={6}>
          <Button
            variant="contained"
            size="large"
            startIcon={<Add />}
            onClick={handleNewModule}
            sx={{ py: 2, px: 4 }}
          >
            Начать изучать
          </Button>
        </Box>

        {/* Все доступные уроки */}
        <Stack spacing={3} mb={6}>
          <Box display="flex" alignItems="center" gap={1}>
            <MenuBook color="primary" />
            <Typography variant="h2">Все доступные уроки</Typography>
          </Box>

          <LessonsList
            lessons={lessons}
            loading={lessonsLoading}
            error={lessonsError}
          />
        </Stack>

        {/* Модули для повторения */}
        <Stack spacing={3}>
          <Box display="flex" alignItems="center" gap={1}>
            <AccessTime color="primary" />
            <Typography variant="h2">Требуют повторения</Typography>
          </Box>

          <ReviewLessonsList maxItems={6} />
        </Stack>
      </Container>
      <ContentCreationModal
        open={isNewModuleModalOpen}
        onClose={() => setIsNewModuleModalOpen(false)}
      />
    </Box>
  );
};
