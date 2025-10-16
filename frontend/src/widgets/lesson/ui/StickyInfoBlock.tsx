import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  Stack,
  Divider,
  Chip,
  LinearProgress,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Quiz,
  Schedule,
  DateRange,
  AutoAwesome,
  CheckCircle,
  PlayCircle,
  Info,
  AccessTime,
  TrendingUp,
  Grade,
} from '@mui/icons-material';
import type { Lesson } from '../../../shared/api/lessons';
import { TestModal } from '../../test/ui';
import { testsApi } from '../../../shared/api/tests';
import type { TestData } from '../../test/types';
import type { ExamHistoryItem } from '../../../shared/api/tests/types';
import { useCurrentUser } from '../../../shared/model';
import { LessonManagementMenu } from './LessonManagementMenu';
import { LessonDeleteDialog } from './LessonDeleteDialog';
import { lessonsApi } from '../../../shared/api/lessons/api';
import { useNavigate } from 'react-router';

interface StickyInfoBlockProps {
  lesson: Lesson | null;
  notFound: boolean;
}

const formatDate = (dateString?: string) => {
  if (!dateString) return 'Не указана';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

type StatusKey = 'not_started' | 'learning' | 'mastered';

const getStatusInfo = (status: string) => {
  const statuses = {
    not_started: {
      label: 'Не начат',
      color: 'default' as const,
      icon: <PlayCircle sx={{ fontSize: 18 }} />,
    },
    learning: {
      label: 'В изучении',
      color: 'primary' as const,
      icon: <AutoAwesome sx={{ fontSize: 18 }} />,
    },
    mastered: {
      label: 'Освоен',
      color: 'success' as const,
      icon: <CheckCircle sx={{ fontSize: 18 }} />,
    },
  };
  return statuses[status as StatusKey] || statuses.not_started;
};

const getDifficultyInfo = (difficulty?: number) => {
  if (!difficulty) return null;

  const levels = [
    { label: 'Очень легко', color: 'success' as const, range: [1, 2] },
    { label: 'Легко', color: 'success' as const, range: [3, 4] },
    { label: 'Средне', color: 'warning' as const, range: [5, 6] },
    { label: 'Сложно', color: 'error' as const, range: [7, 8] },
    { label: 'Очень сложно', color: 'error' as const, range: [9, 10] },
  ];

  const level = levels.find(
    (l) => difficulty >= l.range[0] && difficulty <= l.range[1],
  );
  return level || levels[2]; // По умолчанию средний уровень
};

export const StickyInfoBlock = ({ lesson, notFound }: StickyInfoBlockProps) => {
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [testData, setTestData] = useState<TestData | null>(null);
  const [isLoadingTest, setIsLoadingTest] = useState(false);
  const [testError, setTestError] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeletingLesson, setIsDeletingLesson] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [lessonExams, setLessonExams] = useState<ExamHistoryItem[]>([]);
  const { userId } = useCurrentUser();
  const navigate = useNavigate();

  const statusInfo = lesson
    ? getStatusInfo(lesson.status)
    : getStatusInfo('not_started');

  // Загружаем экзамены для урока
  useEffect(() => {
    const fetchLessonExams = async () => {
      if (!lesson || !userId) return;

      try {
        console.log('Fetching exams for lesson:', lesson.id, 'user:', userId);
        const exams = await testsApi.getLessonExams({
          lessonId: lesson.id,
          userId,
        });
        console.log('Fetched exams:', exams);
        setLessonExams(exams);
      } catch (error) {
        console.error('Failed to fetch lesson exams:', error);
      }
    };

    fetchLessonExams();
  }, [lesson, userId]);

  // Получаем последний завершенный экзамен
  const latestCompletedExam = lessonExams.find(
    (exam) => exam.status === 'completed',
  );

  console.log('Latest completed exam:', latestCompletedExam);
  console.log('All lesson exams:', lessonExams);

  const handleOpenTest = async () => {
    if (!lesson) return;

    setIsLoadingTest(true);
    setTestError(null);

    try {
      const generatedTest = await testsApi.generateTestForLesson({
        lessonId: lesson.id,
        userId: userId ?? '',
        questionCount: 5,
      });

      setTestData(generatedTest);
      setIsTestModalOpen(true);
    } catch (error) {
      console.error('Failed to generate test:', error);
      setTestError(
        error instanceof Error ? error.message : 'Не удалось загрузить тест',
      );
    } finally {
      setIsLoadingTest(false);
    }
  };

  const handleCloseTest = () => {
    setIsTestModalOpen(false);
    setTestData(null);
    setTestError(null);
  };

  const handleDeleteLesson = () => {
    setIsDeleteDialogOpen(true);
    setDeleteError(null);
  };

  const handleConfirmDelete = async () => {
    if (!lesson) return;

    setIsDeletingLesson(true);
    setDeleteError(null);

    try {
      await lessonsApi.deleteLesson(lesson.id);
      // Редирект на главную страницу после успешного удаления
      navigate('/');
    } catch (error) {
      console.error('Failed to delete lesson:', error);
      setDeleteError(
        error instanceof Error ? error.message : 'Не удалось удалить урок',
      );
    } finally {
      setIsDeletingLesson(false);
    }
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setDeleteError(null);
  };

  return (
    <>
      <Box
        component={Paper}
        elevation={0}
        sx={{
          position: 'sticky',
          top: '20px',
          p: 3,
          width: '300px',
          flexShrink: 0,
          alignSelf: 'flex-start',
          border: '2px solid',
          borderColor: 'primary.100',
          borderRadius: 3,
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fbff 100%)',
          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.08)',
        }}
      >
        <Stack spacing={3}>
          {/* Заголовок */}
          <Box>
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{
                background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 0.5,
              }}
            >
              Информация
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Детали урока
            </Typography>
          </Box>

          <Divider />

          {/* Статус */}
          <Stack spacing={1.5}>
            <Typography variant="body2" fontWeight={600} color="text.primary">
              Статус прохождения
            </Typography>
            <Chip
              icon={statusInfo.icon}
              label={statusInfo.label}
              color={statusInfo.color}
              size="medium"
              sx={{
                alignSelf: 'flex-start',
                fontWeight: 600,
                px: 1,
                borderRadius: 2,
              }}
            />

            {/* Результат последнего теста */}
            {latestCompletedExam && (
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: 'success.50',
                  border: '1px solid',
                  borderColor: 'success.200',
                }}
              >
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Grade sx={{ fontSize: 18, color: 'success.main' }} />
                  <Typography
                    variant="caption"
                    fontWeight={600}
                    color="success.main"
                  >
                    Последний результат теста
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    color="success.main"
                  >
                    {Math.round(latestCompletedExam.score)}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    (
                    {
                      latestCompletedExam.results.filter((r) => r.is_correct)
                        .length
                    }{' '}
                    из {latestCompletedExam.results.length})
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {new Date(
                    latestCompletedExam.completed_at!,
                  ).toLocaleDateString('ru-RU')}
                </Typography>
              </Box>
            )}

            {lesson && lesson.status === 'learning' && !latestCompletedExam && (
              <Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 0.5,
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Прогресс
                  </Typography>
                  <Typography
                    variant="caption"
                    fontWeight={600}
                    color="primary.main"
                  >
                    65%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={65}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    bgcolor: 'primary.50',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 3,
                    },
                  }}
                />
              </Box>
            )}
          </Stack>

          <Divider />

          {/* Время чтения и сложность */}
          {lesson && (lesson.reading_time || lesson.difficulty) && (
            <>
              <Stack spacing={2}>
                {lesson.reading_time && (
                  <Box>
                    <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                      <AccessTime
                        sx={{ fontSize: 18, color: 'primary.main' }}
                      />
                      <Typography
                        variant="caption"
                        fontWeight={600}
                        color="text.primary"
                      >
                        Время чтения
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ pl: 3 }}
                    >
                      {lesson.reading_time} мин
                    </Typography>
                  </Box>
                )}

                {lesson.difficulty && (
                  <Box>
                    <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                      <TrendingUp
                        sx={{ fontSize: 18, color: 'primary.main' }}
                      />
                      <Typography
                        variant="caption"
                        fontWeight={600}
                        color="text.primary"
                      >
                        Сложность
                      </Typography>
                    </Box>
                    <Box sx={{ pl: 3 }}>
                      <Chip
                        label={getDifficultyInfo(lesson.difficulty)?.label}
                        color={getDifficultyInfo(lesson.difficulty)?.color}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          borderRadius: 2,
                        }}
                      />
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ ml: 1 }}
                      >
                        ({lesson.difficulty}/10)
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Stack>

              <Divider />
            </>
          )}

          {/* Даты */}
          <Stack spacing={2}>
            <Box>
              <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                <DateRange sx={{ fontSize: 18, color: 'primary.main' }} />
                <Typography
                  variant="caption"
                  fontWeight={600}
                  color="text.primary"
                >
                  Дата создания
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ pl: 3 }}>
                {lesson ? formatDate(lesson.created_at) : 'Не указана'}
              </Typography>
            </Box>

            {lesson && lesson.last_reviewed_at && (
              <Box>
                <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                  <Schedule sx={{ fontSize: 18, color: 'primary.main' }} />
                  <Typography
                    variant="caption"
                    fontWeight={600}
                    color="text.primary"
                  >
                    Последнее изучение
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ pl: 3 }}
                >
                  {formatDate(lesson.last_reviewed_at)}
                </Typography>
              </Box>
            )}

            {lesson && lesson.next_review_at && (
              <Box>
                <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                  <Schedule sx={{ fontSize: 18, color: 'success.main' }} />
                  <Typography
                    variant="caption"
                    fontWeight={600}
                    color="text.primary"
                  >
                    Следующее повторение
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ pl: 3 }}
                >
                  {formatDate(lesson.next_review_at)}
                </Typography>
              </Box>
            )}
          </Stack>

          {/* Информация о порядке */}
          {lesson && (
            <>
              <Divider />
              <Box>
                <Typography
                  variant="caption"
                  fontWeight={600}
                  color="text.primary"
                  display="block"
                  mb={1}
                >
                  Позиция в курсе
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: 'primary.50',
                  }}
                >
                  <Typography
                    variant="h4"
                    fontWeight={700}
                    color="primary.main"
                  >
                    #{lesson.order}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    урок
                  </Typography>
                </Box>
              </Box>
            </>
          )}

          {notFound && (
            <>
              <Divider />
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: 'info.50',
                  border: '1px solid',
                  borderColor: 'info.200',
                }}
              >
                <Box display="flex" alignItems="flex-start" gap={1}>
                  <Info sx={{ fontSize: 18, color: 'info.main', mt: 0.2 }} />
                  <Typography variant="caption" color="info.main">
                    Это демо-урок. Данные показаны для примера.
                  </Typography>
                </Box>
              </Box>
            </>
          )}

          <Divider />

          {/* Кнопка теста */}
          <Button
            variant="contained"
            fullWidth
            startIcon={
              isLoadingTest ? <CircularProgress size={20} /> : <Quiz />
            }
            disabled={notFound || isLoadingTest}
            onClick={handleOpenTest}
            sx={{
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25)',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(59, 130, 246, 0.35)',
              },
            }}
          >
            {isLoadingTest
              ? 'Загрузка теста...'
              : latestCompletedExam
                ? 'Пройти тест снова'
                : 'Пройти тест'}
          </Button>

          {/* Ошибка загрузки теста */}
          {testError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {testError}
            </Alert>
          )}

          {lesson && (
            <Typography
              variant="caption"
              color="text.secondary"
              textAlign="center"
            >
              Интервал повторения: {lesson.interval} дней
            </Typography>
          )}

          {/* Меню управления уроком */}
          <LessonManagementMenu
            lesson={lesson}
            onDeleteLesson={handleDeleteLesson}
          />
        </Stack>
      </Box>

      {/* Модальное окно теста */}
      {testData && (
        <TestModal
          open={isTestModalOpen}
          onClose={handleCloseTest}
          testData={testData}
        />
      )}

      {/* Модальное окно удаления урока */}
      <LessonDeleteDialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        lessonTitle={lesson?.title}
        isLoading={isDeletingLesson}
        error={deleteError}
      />
    </>
  );
};
