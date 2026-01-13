import { useMemo, useState, useEffect } from 'react';
import {
  Container,
  Button,
  Typography,
  Box,
  Stack,
  AppBar,
  Toolbar,
  Grid,
  Chip,
  Alert,
  CircularProgress,
  Paper,
  Fab,
  Tooltip,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  Add,
  MenuBook,
  AccessTime,
  TrendingDown,
  AutoAwesome,
  PlayCircleOutline,
  KeyboardArrowRight,
} from '@mui/icons-material';
import { ContentCreationModal } from '@features/education-module/ui';
import { lessonsApi } from '@shared/api/lessons/api';
import type { Lesson, LessonForReview } from '@shared/api/lessons/types';
import { useNavigate } from 'react-router';
import { LessonStatus } from '@shared/api/lessons/types';
import { LessonCard } from '@features/lesson-card/ui/LessonCard';
import { useCurrentUser } from '@shared/model/users';
import { testsApi } from '@shared/api/tests/api';
import type { ExamHistoryItem } from '@shared/api/tests/types';

export const HomePage = () => {
  const navigate = useNavigate();
  const { userId } = useCurrentUser();
  const [creationTab, setCreationTab] = useState<'lesson' | 'course'>('lesson');
  const [isCreationModalOpen, setIsCreationModalOpen] = useState(false);

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [lessonsLoading, setLessonsLoading] = useState(true);
  const [lessonsError, setLessonsError] = useState<string | null>(null);

  const handleLessonClick = (lesson: Lesson) => {
    const courseId = lesson.unit.course.id;
    const unitId = lesson.unit.id;
    const lessonId = lesson.id;

    // Используем маршрут с полной иерархией: courses/:id/units/:unitId/lessons/:lessonId
    navigate(`/courses/${courseId}/units/${unitId}/lessons/${lessonId}`);
  };

  const openCreation = (tab: 'lesson' | 'course' = 'lesson') => {
    setCreationTab(tab);
    setIsCreationModalOpen(true);
  };

  // Повторение (SM-2): источник истины — endpoint /lessons/for-review/:userId
  const [reviewLessons, setReviewLessons] = useState<LessonForReview[]>([]);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [reviewError, setReviewError] = useState<string | null>(null);

  // История тестов — используем для подсчёта "слабых мест"
  const [exams, setExams] = useState<ExamHistoryItem[]>([]);
  const [examsLoading, setExamsLoading] = useState(true);
  const [examsError, setExamsError] = useState<string | null>(null);

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

  useEffect(() => {
    const fetchReview = async () => {
      if (!userId) return;
      try {
        setReviewLoading(true);
        setReviewError(null);
        const data = await lessonsApi.getLessonsForReview(userId);
        setReviewLessons(data);
      } catch (error) {
        setReviewError(
          error instanceof Error
            ? error.message
            : 'Ошибка загрузки уроков для повторения',
        );
      } finally {
        setReviewLoading(false);
      }
    };

    void fetchReview();
  }, [userId]);

  useEffect(() => {
    const fetchExams = async () => {
      if (!userId) return;
      try {
        setExamsLoading(true);
        setExamsError(null);
        const data = await testsApi.getUserExams({ userId });
        setExams(data);
      } catch (error) {
        setExamsError(
          error instanceof Error
            ? error.message
            : 'Ошибка загрузки истории тестов',
        );
      } finally {
        setExamsLoading(false);
      }
    };

    void fetchExams();
  }, [userId]);

  useEffect(() => {
    const handleLessonUpdate = () => {
      // Обновляем данные, которые зависят от результатов тестов
      const refresh = async () => {
        if (!userId) return;
        try {
          const [reviewData, lessonsData, examsData] = await Promise.all([
            lessonsApi.getLessonsForReview(userId),
            lessonsApi.getAllLessons(),
            testsApi.getUserExams({ userId }),
          ]);
          setReviewLessons(reviewData);
          setLessons(lessonsData);
          setExams(examsData);
        } catch {
          // Ошибки уже покрыты отдельными экранами/алертами — здесь тихо обновляем
        }
      };

      void refresh();
    };

    window.addEventListener('lessonUpdated', handleLessonUpdate);
    return () =>
      window.removeEventListener('lessonUpdated', handleLessonUpdate);
  }, [userId]);

  const reviewSorted = useMemo(() => {
    return [...reviewLessons].sort((a, b) => {
      return (
        new Date(a.next_review_at).getTime() -
        new Date(b.next_review_at).getTime()
      );
    });
  }, [reviewLessons]);

  const reviewCounters = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const startOfTomorrow = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
    );
    const startOfSoon = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 7,
    );

    let overdue = 0;
    let today = 0;
    let soon = 0;

    for (const lesson of reviewLessons) {
      const d = new Date(lesson.next_review_at);
      if (d < startOfToday) overdue += 1;
      else if (d >= startOfToday && d < startOfTomorrow) today += 1;
      else if (d >= startOfTomorrow && d < startOfSoon) soon += 1;
    }

    return { overdue, today, soon };
  }, [reviewLessons]);

  type WeakLesson = {
    lesson: Lesson;
    avgScore: number;
    lastCompletedAt?: string;
  };

  const weakLessons = useMemo<WeakLesson[]>(() => {
    // Собираем индекс уроков, чтобы связать экзамены с уроками.
    // На бэке связь хранится в заголовке экзамена: "Тест по уроку: {название урока}"
    const byCourseAndTitle = new Map<string, Lesson>();
    for (const l of lessons) {
      byCourseAndTitle.set(`${l.unit.course.id}::${l.title}`, l);
    }

    const prefix = 'Тест по уроку: ';
    const scoresByLessonId = new Map<
      string,
      { scores: number[]; lastCompletedAt?: string }
    >();

    for (const exam of exams) {
      if (exam.status !== 'completed' || !exam.completed_at) continue;
      if (!exam.title.startsWith(prefix)) continue;
      const lessonTitle = exam.title.slice(prefix.length);
      const lesson = byCourseAndTitle.get(`${exam.course.id}::${lessonTitle}`);
      if (!lesson) continue;

      const existing = scoresByLessonId.get(lesson.id) ?? { scores: [] };
      existing.scores.push(exam.score);
      // exams приходят отсортированными DESC по completed_at на бэке, но не полагаемся
      if (!existing.lastCompletedAt)
        existing.lastCompletedAt = exam.completed_at;
      scoresByLessonId.set(lesson.id, existing);
    }

    const items: WeakLesson[] = [];
    for (const [lessonId, s] of scoresByLessonId.entries()) {
      const lesson = lessons.find((l) => l.id === lessonId);
      if (!lesson) continue;
      const last3 = s.scores.slice(0, 3);
      const avg =
        last3.reduce((acc, v) => acc + v, 0) / Math.max(1, last3.length);
      items.push({ lesson, avgScore: avg, lastCompletedAt: s.lastCompletedAt });
    }

    // “Слабые места”: низкий средний балл по последним попыткам
    const threshold = 70;
    return items
      .filter((x) => x.avgScore < threshold)
      .sort((a, b) => a.avgScore - b.avgScore)
      .slice(0, 6);
  }, [exams, lessons]);

  const notStudiedLessons = useMemo(() => {
    return lessons
      .filter((l) => l.status === LessonStatus.NOT_STARTED)
      .slice(0, 9);
  }, [lessons]);

  const userReady = Boolean(userId);
  const weakLoading = examsLoading || lessonsLoading;
  const weakError = examsError || lessonsError;

  const handleStartReview = () => {
    const first = reviewSorted[0];
    if (!first) return;
    void navigate(`/courses/${first.unit.course.id}/lessons/${first.id}`);
  };

  const handleOpenReview = () => void navigate('/review');

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Заголовок */}
      <AppBar position="static" elevation={0}>
        <Toolbar sx={{ flexDirection: 'column', py: 4 }}>
          <Typography variant="h1" component="h1" gutterBottom>
            PathwiseAI
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Персональная система обучения с искусственным интеллектом
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Stack spacing={4}>
          {/* 1) Повторить */}
          <Stack spacing={1.75}>
            <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
              <AccessTime color="primary" />
              <Typography variant="h2">Повторить</Typography>
              <Box sx={{ flexGrow: 1 }} />
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<PlayCircleOutline />}
                  onClick={handleStartReview}
                  disabled={reviewSorted.length === 0 || reviewLoading}
                >
                  Начать
                </Button>
                <Button
                  variant="text"
                  size="small"
                  endIcon={<KeyboardArrowRight />}
                  onClick={handleOpenReview}
                  sx={{ color: 'text.secondary' }}
                >
                  Все
                </Button>
              </Stack>
            </Box>

            <Box display="flex" gap={1} flexWrap="wrap" sx={{ mt: 0.25 }}>
              <Chip
                label={`Просрочено: ${reviewCounters.overdue}`}
                color={reviewCounters.overdue > 0 ? 'error' : 'default'}
                variant={reviewCounters.overdue > 0 ? 'filled' : 'outlined'}
                size="small"
              />
              <Chip
                label={`Сегодня: ${reviewCounters.today}`}
                color={reviewCounters.today > 0 ? 'warning' : 'default'}
                variant={reviewCounters.today > 0 ? 'filled' : 'outlined'}
                size="small"
              />
              <Chip
                label={`Скоро: ${reviewCounters.soon}`}
                color="default"
                variant="outlined"
                size="small"
              />
            </Box>

            {(!userReady || reviewLoading) && (
              <Box display="flex" justifyContent="center" py={2}>
                <CircularProgress />
              </Box>
            )}
            {reviewError && <Alert severity="error">{reviewError}</Alert>}
            {userReady &&
              !reviewLoading &&
              !reviewError &&
              reviewSorted.length === 0 && (
                <Paper
                  variant="outlined"
                  sx={{ p: 2.5, borderRadius: 3, textAlign: 'center' }}
                >
                  <Typography variant="body1" color="text.secondary">
                    Сейчас нет уроков для повторения
                  </Typography>
                </Paper>
              )}

            {userReady &&
              !reviewLoading &&
              !reviewError &&
              reviewSorted.length > 0 && (
                <Grid container spacing={2}>
                  {reviewSorted.slice(0, 9).map((lesson) => (
                    <Grid key={lesson.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                      <LessonCard
                        lesson={lesson}
                        variant="review"
                        onClick={() =>
                          void navigate(
                            `/courses/${lesson.unit.course.id}/lessons/${lesson.id}`,
                          )
                        }
                        onAction={() =>
                          void navigate(
                            `/courses/${lesson.unit.course.id}/lessons/${lesson.id}`,
                          )
                        }
                      />
                    </Grid>
                  ))}
                </Grid>
              )}
          </Stack>

          {/* 2) Слабые места */}
          <Stack spacing={1.75}>
            <Box display="flex" alignItems="center" gap={1}>
              <TrendingDown color="primary" />
              <Typography variant="h2">Слабые места</Typography>
              <Box sx={{ flexGrow: 1 }} />
              <Button
                variant="text"
                size="small"
                onClick={() => void navigate('/test-history')}
              >
                История тестов
              </Button>
            </Box>

            {weakLoading && (
              <Box display="flex" justifyContent="center" py={2}>
                <CircularProgress />
              </Box>
            )}
            {weakError && <Alert severity="error">{weakError}</Alert>}
            {!weakLoading && !weakError && weakLessons.length === 0 && (
              <Paper
                variant="outlined"
                sx={{ p: 2.5, borderRadius: 3, textAlign: 'center' }}
              >
                <Typography variant="body1" color="text.secondary">
                  Пока нет “слабых мест” по результатам тестов — так держать
                </Typography>
              </Paper>
            )}

            {!weakLoading && !weakError && weakLessons.length > 0 && (
              <Grid container spacing={2}>
                {weakLessons.map(({ lesson, avgScore }) => (
                  <Grid key={lesson.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                    <Box sx={{ position: 'relative', height: '100%' }}>
                      <LessonCard
                        lesson={lesson}
                        variant="default"
                        onClick={() => handleLessonClick(lesson)}
                      />

                      <Chip
                        label={`${Math.round(avgScore)}%`}
                        size="small"
                        sx={{
                          position: 'absolute',
                          // В LessonCard появился бейдж в правом верхнем углу.
                          // Сдвигаем процент ниже, чтобы не перекрывать статус.
                          top: 44,
                          right: 12,
                          zIndex: 1,
                          pointerEvents: 'none',
                          fontWeight: 700,
                          color: avgScore < 50 ? 'error.main' : 'warning.main',
                          bgcolor: (t) =>
                            alpha(
                              avgScore < 50
                                ? t.palette.error.main
                                : t.palette.warning.main,
                              0.12,
                            ),
                          border: '1px solid',
                          borderColor: 'divider',
                        }}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}
          </Stack>

          {/* 3) Не изучал */}
          <Stack spacing={1.75}>
            <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
              <MenuBook color="primary" />
              <Typography variant="h2">Не изучал</Typography>
              <Box sx={{ flexGrow: 1 }} />
              <Button
                variant="text"
                size="small"
                onClick={() => void navigate('/courses')}
              >
                Открыть курсы
              </Button>
            </Box>

            {lessonsLoading && (
              <Box display="flex" justifyContent="center" py={2}>
                <CircularProgress />
              </Box>
            )}
            {lessonsError && <Alert severity="error">{lessonsError}</Alert>}
            {!lessonsLoading &&
              !lessonsError &&
              notStudiedLessons.length === 0 && (
                <Paper
                  variant="outlined"
                  sx={{ p: 2.5, borderRadius: 3, textAlign: 'center' }}
                >
                  <Typography variant="body1" color="text.secondary">
                    Похоже, новых уроков не осталось — можно создать следующий
                  </Typography>
                </Paper>
              )}

            {!lessonsLoading &&
              !lessonsError &&
              notStudiedLessons.length > 0 && (
                <Grid container spacing={2}>
                  {notStudiedLessons.map((lesson) => (
                    <Grid key={lesson.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                      <LessonCard
                        lesson={lesson}
                        variant="default"
                        onClick={() => handleLessonClick(lesson)}
                      />
                    </Grid>
                  ))}
                </Grid>
              )}
          </Stack>

          {/* 4) Открыть новое */}
          <Stack spacing={1.75}>
            <Box display="flex" alignItems="center" gap={1}>
              <AutoAwesome color="primary" />
              <Typography variant="h2">Открыть новое</Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper
                  variant="outlined"
                  sx={{ p: 2.5, borderRadius: 3, height: '100%' }}
                >
                  <Stack spacing={1.5}>
                    <Typography variant="h3">Быстрый урок</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Сформулируй тему — система создаст урок и тест, а дальше
                      возьмёт повторения на себя.
                    </Typography>
                    <Box>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<Add />}
                        onClick={() => openCreation('lesson')}
                      >
                        Создать урок
                      </Button>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper
                  variant="outlined"
                  sx={{ p: 2.5, borderRadius: 3, height: '100%' }}
                >
                  <Stack spacing={1.5}>
                    <Typography variant="h3">Новый курс</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Если хочешь системно освоить тему — создай курс-скелет и
                      пополняй его уроками.
                    </Typography>
                    <Box>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Add />}
                        onClick={() => openCreation('course')}
                      >
                        Создать курс
                      </Button>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>
            </Grid>
          </Stack>
        </Stack>
      </Container>

      {/* Всегда видимая кнопка создания */}
      <Tooltip title="Создать" placement="left">
        <Fab
          color="primary"
          onClick={() => openCreation('lesson')}
          sx={{
            position: 'fixed',
            right: 20,
            bottom: 20,
            zIndex: (t) => t.zIndex.drawer + 2,
          }}
          aria-label="Создать урок или курс"
        >
          <Add />
        </Fab>
      </Tooltip>

      <ContentCreationModal
        open={isCreationModalOpen}
        onClose={() => setIsCreationModalOpen(false)}
        initialTab={creationTab}
      />
    </Box>
  );
};
