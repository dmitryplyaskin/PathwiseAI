import { useState, useEffect } from 'react';
import {
  Container,
  Button,
  Typography,
  Box,
  Stack,
  AppBar,
  Toolbar,
  Tooltip,
  IconButton,
<<<<<<< HEAD
  Grid,
  Card,
  CardContent,
  Chip,
=======
>>>>>>> 91b452a1fc247d3be529e23f34295663cfd4a947
} from '@mui/material';
import {
  Add,
  MenuBook,
  AccessTime,
  ChevronLeft,
  ChevronRight,
} from '@mui/icons-material';
import { ContentCreationModal } from '@features/education-module/ui';
import { LessonsList } from '@widgets/lessons-list';
import { ReviewLessonsList } from '@widgets/review-lessons';
import { lessonsApi } from '@shared/api/lessons/api';
import type { Lesson } from '@shared/api/lessons/types';
import { useNavigate } from 'react-router';
<<<<<<< HEAD
=======

const reviewModules = [
  {
    id: 4,
    title: 'Алгоритмы сортировки',
    description:
      'Повторение основных алгоритмов сортировки и их временной сложности',
    dueDate: 'Сегодня',
    priority: 'high',
  },
  {
    id: 5,
    title: 'CSS Flexbox',
    description: 'Закрепление знаний о флексбокс-контейнерах и их свойствах',
    dueDate: 'Завтра',
    priority: 'medium',
  },
  {
    id: 6,
    title: 'Git команды',
    description: 'Повторение основных команд Git для работы с репозиторием',
    dueDate: 'Через 2 дня',
    priority: 'low',
  },
];
>>>>>>> 91b452a1fc247d3be529e23f34295663cfd4a947

export const HomePage = () => {
  const navigate = useNavigate();
  const [isNewModuleModalOpen, setIsNewModuleModalOpen] = useState(false);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [lessonsLoading, setLessonsLoading] = useState(true);
  const [lessonsError, setLessonsError] = useState<string | null>(null);
  const [reviewSliderIndex, setReviewSliderIndex] = useState(0);

  const handleNewModule = () => {
    setIsNewModuleModalOpen(true);
  };

  const handleLessonClick = (lesson: Lesson) => {
    const courseId = lesson.unit.course.id;
    const unitId = lesson.unit.id;
    const lessonId = lesson.id;

    // Используем маршрут с полной иерархией: courses/:id/units/:unitId/lessons/:lessonId
    navigate(`/courses/${courseId}/units/${unitId}/lessons/${lessonId}`);
<<<<<<< HEAD
=======
  };

  const handleModuleClick = (moduleId: string) => {
    console.log('Клик по модуль:', moduleId);
>>>>>>> 91b452a1fc247d3be529e23f34295663cfd4a947
  };

  // Фильтрация уроков для повторения (лимит 5 дней)
  const getLessonsForReview = (lessons: Lesson[]): Lesson[] => {
    const now = new Date();
    const fiveDaysFromNow = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);

    return lessons
      .filter((lesson) => {
        if (!lesson.next_review_at) return false;
        const reviewDate = new Date(lesson.next_review_at);
        return reviewDate <= fiveDaysFromNow && reviewDate >= now;
      })
      .sort((a, b) => {
        const dateA = new Date(a.next_review_at!);
        const dateB = new Date(b.next_review_at!);
        return dateA.getTime() - dateB.getTime();
      });
  };

  const lessonsForReview = getLessonsForReview(lessons);

  // Функции для слайдера
  const itemsPerSlide = 3;
  const maxSlides = Math.ceil(lessonsForReview.length / itemsPerSlide) - 1;

  const handlePrevSlide = () => {
    setReviewSliderIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNextSlide = () => {
    setReviewSliderIndex((prev) => Math.min(maxSlides, prev + 1));
  };

  const getCurrentSlideLessons = () => {
    const startIndex = reviewSliderIndex * itemsPerSlide;
    return lessonsForReview.slice(startIndex, startIndex + itemsPerSlide);
  };

  // Форматирование даты для отображения
  const formatReviewDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Сегодня';
    if (diffDays === 1) return 'Завтра';
    if (diffDays === 2) return 'Послезавтра';
    return `Через ${diffDays} дней`;
  };
<<<<<<< HEAD
=======

>>>>>>> 91b452a1fc247d3be529e23f34295663cfd4a947
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

        {/* Блок "Нужно повторить" */}
        {lessonsForReview.length > 0 && (
          <Stack spacing={3} mb={6}>
            <Box display="flex" alignItems="center" gap={1}>
              <AccessTime color="primary" />
              <Typography variant="h2">Нужно повторить</Typography>
            </Box>

            <Box sx={{ position: 'relative' }}>
              <Grid container spacing={3}>
                {getCurrentSlideLessons().map((lesson) => (
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
                              <Tooltip title={lesson.title} arrow>
                                <Typography
                                  variant="h6"
                                  component="h3"
                                  sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {lesson.title}
                                </Typography>
                              </Tooltip>
                              <Tooltip
                                title={`${lesson.unit.course.title} → ${lesson.unit.title}`}
                                arrow
                              >
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    display: 'block',
                                  }}
                                >
                                  {lesson.unit.course.title} →{' '}
                                  {lesson.unit.title}
                                </Typography>
                              </Tooltip>
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
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {lesson.next_review_at &&
                                formatReviewDate(lesson.next_review_at)}
                            </Typography>

                            <Chip
                              label="Повторить"
                              color="warning"
                              size="small"
                            />
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {/* Кнопки навигации слайдера */}
              {maxSlides > 0 && (
                <>
                  <IconButton
                    onClick={handlePrevSlide}
                    disabled={reviewSliderIndex === 0}
                    sx={{
                      position: 'absolute',
                      left: -16,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      backgroundColor: 'background.paper',
                      boxShadow: 2,
                      '&:hover': {
                        backgroundColor: 'background.paper',
                      },
                    }}
                  >
                    <ChevronLeft />
                  </IconButton>

                  <IconButton
                    onClick={handleNextSlide}
                    disabled={reviewSliderIndex === maxSlides}
                    sx={{
                      position: 'absolute',
                      right: -16,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      backgroundColor: 'background.paper',
                      boxShadow: 2,
                      '&:hover': {
                        backgroundColor: 'background.paper',
                      },
                    }}
                  >
                    <ChevronRight />
                  </IconButton>
                </>
              )}
            </Box>
          </Stack>
        )}

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
