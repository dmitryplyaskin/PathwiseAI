import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  Stack,
  Divider,
  Chip,
  CircularProgress,
  Alert,
  useTheme,
  alpha,
  Tooltip,
} from '@mui/material';
import {
  Quiz,
  Schedule,
  DateRange,
  AutoAwesome,
  CheckCircle,
  PlayCircle,
  AccessTime,
  TrendingUp,
  Grade,
  Info,
  Settings,
} from '@mui/icons-material';
import type { Lesson } from '@shared/api/lessons';
import { TestModal } from '../../test/ui';
import { testsApi } from '@shared/api/tests';
import type { TestData } from '../../test/types';
import type { ExamHistoryItem } from '@shared/api/tests/types';
import { useCurrentUser } from '@shared/model';
import { LessonManagementMenu } from './LessonManagementMenu';
import { LessonDeleteDialog } from './LessonDeleteDialog';
import { ResetProgressDialog } from './ResetProgressDialog';
import { lessonsApi } from '@shared/api/lessons/api';
import { loadLesson } from '@shared/model/lessons/lessons-model';
import { useNavigate } from 'react-router';
import {
  TestGenerationSettingsModal,
  type TestGenerationSettings,
} from './TestGenerationSettingsModal';

interface StickyInfoBlockProps {
  lesson: Lesson | null;
  notFound: boolean;
}

const formatDate = (dateString?: string) => {
  if (!dateString) return 'Не указана';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

type StatusKey = 'not_started' | 'learning' | 'mastered';

const getStatusInfo = (status: string) => {
  const statuses = {
    not_started: {
      label: 'Не начат',
      color: 'default' as const,
      icon: <PlayCircle sx={{ fontSize: 16 }} />,
      bg: 'rgba(0, 0, 0, 0.04)',
      text: '#64748b',
    },
    learning: {
      label: 'В изучении',
      color: 'primary' as const,
      icon: <AutoAwesome sx={{ fontSize: 16 }} />,
      bg: 'rgba(59, 130, 246, 0.1)',
      text: '#3b82f6',
    },
    mastered: {
      label: 'Освоен',
      color: 'success' as const,
      icon: <CheckCircle sx={{ fontSize: 16 }} />,
      bg: 'rgba(16, 185, 129, 0.1)',
      text: '#10b981',
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
  return level || levels[2];
};

const MetaItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) => (
  <Box>
    <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
      <Box sx={{ color: 'text.secondary', display: 'flex' }}>{icon}</Box>
      <Typography variant="caption" color="text.secondary" fontWeight={500}>
        {label}
      </Typography>
    </Box>
    <Typography variant="body2" fontWeight={600} color="text.primary">
      {value}
    </Typography>
  </Box>
);

export const StickyInfoBlock = ({ lesson, notFound }: StickyInfoBlockProps) => {
  const theme = useTheme();
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [testData, setTestData] = useState<TestData | null>(null);
  const [isLoadingTest, setIsLoadingTest] = useState(false);
  const [testError, setTestError] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeletingLesson, setIsDeletingLesson] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isResetProgressDialogOpen, setIsResetProgressDialogOpen] = useState(false);
  const [isResettingProgress, setIsResettingProgress] = useState(false);
  const [resetProgressError, setResetProgressError] = useState<string | null>(null);
  const [lessonExams, setLessonExams] = useState<ExamHistoryItem[]>([]);
  const { userId } = useCurrentUser();
  const navigate = useNavigate();

  const statusInfo = lesson
    ? getStatusInfo(lesson.status)
    : getStatusInfo('not_started');

  useEffect(() => {
    const fetchLessonExams = async () => {
      if (!lesson || !userId) return;
      try {
        const exams = await testsApi.getLessonExams({
          lessonId: lesson.id,
          userId,
        });
        setLessonExams(exams);
      } catch (error) {
        console.error('Failed to fetch lesson exams:', error);
      }
    };
    void fetchLessonExams();
  }, [lesson, userId]);

  useEffect(() => {
    const handleLessonUpdate = (event: CustomEvent<{ lessonId: string }>) => {
      if (lesson && event.detail.lessonId === lesson.id) {
        const fetchLessonExams = async () => {
          if (!lesson || !userId) return;
          try {
            const exams = await testsApi.getLessonExams({
              lessonId: lesson.id,
              userId,
            });
            setLessonExams(exams);
          } catch (error) {
            console.error('Failed to refresh lesson exams:', error);
          }
        };
        void fetchLessonExams();
      }
    };

    window.addEventListener(
      'lessonUpdated',
      handleLessonUpdate as EventListener,
    );
    return () => {
      window.removeEventListener(
        'lessonUpdated',
        handleLessonUpdate as EventListener,
      );
    };
  }, [lesson, userId]);

  const latestCompletedExam = lessonExams.find(
    (exam) => exam.status === 'completed',
  );

  const handleOpenTest = async (settings?: TestGenerationSettings) => {
    if (!lesson) return;
    setIsLoadingTest(true);
    setTestError(null);
    
    // Close settings modal if open
    if (isSettingsModalOpen) {
      setIsSettingsModalOpen(false);
    }

    try {
      const generatedTest = await testsApi.generateTestForLesson({
        lessonId: lesson.id,
        userId: userId ?? '',
        questionCount: settings?.mode === 'detailed' ? 10 : 5,
        mode: settings?.mode,
        questionTypes: settings?.questionTypes,
      });
      setTestData({ ...generatedTest, lessonId: lesson.id });
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
      void navigate('/');
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

  const handleResetProgress = () => {
    setIsResetProgressDialogOpen(true);
    setResetProgressError(null);
  };

  const handleConfirmResetProgress = async () => {
    if (!lesson || !userId) return;
    setIsResettingProgress(true);
    setResetProgressError(null);
    try {
      await testsApi.deleteLessonProgress({
        lessonId: lesson.id,
        userId,
      });
      loadLesson(lesson.id);
      const exams = await testsApi.getLessonExams({
        lessonId: lesson.id,
        userId,
      });
      setLessonExams(exams);
      window.dispatchEvent(
        new CustomEvent('lessonUpdated', {
          detail: { lessonId: lesson.id },
        }),
      );
      setIsResetProgressDialogOpen(false);
    } catch (error) {
      console.error('Failed to reset progress:', error);
      setResetProgressError(
        error instanceof Error ? error.message : 'Не удалось сбросить прогресс',
      );
    } finally {
      setIsResettingProgress(false);
    }
  };

  const handleCloseResetProgressDialog = () => {
    setIsResetProgressDialogOpen(false);
    setResetProgressError(null);
  };

  return (
    <>
      <Box
        component={Paper}
        elevation={0}
        sx={{
          position: 'sticky',
          top: '24px',
          width: '320px',
          flexShrink: 0,
          alignSelf: 'flex-start',
          borderRadius: 3,
          overflow: 'hidden',
          border: '2px solid',
          borderColor: 'divider',
          background: '#ffffff',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: 'primary.100',
            boxShadow: '0 8px 24px rgba(59, 130, 246, 0.12)',
            transform: 'translateY(-2px)',
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          {/* Header Section */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="flex-start"
            mb={3}
          >
            <Box>
              <Typography variant="h6" fontWeight={800} color="text.primary">
                Детали урока
              </Typography>
              {lesson && (
                <Typography variant="caption" color="text.secondary">
                  #{lesson.order} в курсе
                </Typography>
              )}
            </Box>
            <Chip
              icon={statusInfo.icon}
              label={statusInfo.label}
              size="small"
              sx={{
                bgcolor: statusInfo.bg,
                color: statusInfo.text,
                fontWeight: 600,
                border: 'none',
                '& .MuiChip-icon': {
                  color: 'inherit',
                  },
              }}
            />
          </Box>

          {/* Main Actions */}
          <Stack spacing={2} mb={3}>
            <Box
              sx={{
                display: 'flex',
                borderRadius: 2.5,
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  boxShadow: '0 6px 16px rgba(59, 130, 246, 0.3)',
                  transform: 'translateY(-1px)',
                },
              }}
            >
              <Button
                variant="text"
                fullWidth
                size="medium"
                startIcon={
                  isLoadingTest ? <CircularProgress size={18} color="inherit" /> : <Quiz sx={{ fontSize: 20 }} />
                }
                disabled={notFound || isLoadingTest}
                onClick={() => void handleOpenTest()}
                sx={{
                  py: 1,
                  color: 'white',
                  borderRadius: 0,
                  flex: 1,
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                  '&.Mui-disabled': {
                    color: 'rgba(255, 255, 255, 0.5)',
                  },
                }}
              >
                {isLoadingTest
                  ? 'Загрузка...'
                  : latestCompletedExam
                    ? 'Пройти снова'
                    : 'Начать тест'}
              </Button>
              <Box sx={{ width: '1px', bgcolor: 'rgba(255, 255, 255, 0.2)', my: 0.5 }} />
              <Tooltip title="Настройки теста">
                <Button
                  variant="text"
                  size="medium"
                  disabled={notFound || isLoadingTest}
                  onClick={() => setIsSettingsModalOpen(true)}
                  sx={{
                    minWidth: '40px',
                    px: 0,
                    color: 'white',
                    borderRadius: 0,
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                    },
                    '&.Mui-disabled': {
                      color: 'rgba(255, 255, 255, 0.5)',
                    },
                  }}
                >
                  <Settings fontSize="small" />
                </Button>
              </Tooltip>
            </Box>

            {testError && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {testError}
              </Alert>
            )}
          </Stack>

          <Divider sx={{ my: 3, borderStyle: 'dashed' }} />

          {/* Meta Grid */}
          {lesson && (
            <Box
              display="grid"
              gridTemplateColumns="1fr 1fr"
              gap={3}
              sx={{ mb: 3 }}
            >
              {lesson.reading_time && (
                <MetaItem
                  icon={<AccessTime sx={{ fontSize: 18 }} />}
                  label="Время"
                  value={`${lesson.reading_time} мин`}
                />
              )}
              {lesson.difficulty && (
                <MetaItem
                  icon={<TrendingUp sx={{ fontSize: 18 }} />}
                  label="Сложность"
                  value={
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: getDifficultyInfo(lesson.difficulty)?.color + '.main',
                        }}
                      />
                      {getDifficultyInfo(lesson.difficulty)?.label}
                    </Box>
                  }
                />
              )}
              <MetaItem
                icon={<DateRange sx={{ fontSize: 18 }} />}
                label="Создан"
                value={formatDate(lesson.created_at)}
              />
              {lesson.next_review_at && (
                <MetaItem
                  icon={<Schedule sx={{ fontSize: 18 }} />}
                  label="Повторение"
                  value={formatDate(lesson.next_review_at)}
                />
              )}
            </Box>
          )}

          {/* Last Result Card */}
          {latestCompletedExam && (
            <Box
              sx={{
                p: 2,
                borderRadius: 3,
                bgcolor: alpha(theme.palette.success.main, 0.04),
                border: '1px solid',
                borderColor: alpha(theme.palette.success.main, 0.1),
              }}
            >
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Grade sx={{ fontSize: 18, color: 'success.main' }} />
                  <Typography
                    variant="caption"
                    fontWeight={600}
                    color="success.main"
                  >
                    Результат теста
                  </Typography>
                </Box>
                <Typography variant="caption" color="success.dark">
                  {new Date(latestCompletedExam.completed_at!).toLocaleDateString('ru-RU')}
                </Typography>
              </Box>
              
              <Box display="flex" alignItems="baseline" gap={1}>
                <Typography variant="h4" fontWeight={800} color="success.main">
                  {Math.round(latestCompletedExam.score)}%
                </Typography>
                <Typography variant="body2" color="success.dark" fontWeight={500}>
                  верно
                </Typography>
              </Box>
            </Box>
          )}

          {/* Demo Info */}
          {notFound && (
            <Box
              sx={{
                mt: 2,
                p: 2,
                borderRadius: 3,
                bgcolor: alpha(theme.palette.info.main, 0.05),
                border: '1px solid',
                borderColor: alpha(theme.palette.info.main, 0.1),
                display: 'flex',
                gap: 1.5,
              }}
            >
              <Info sx={{ fontSize: 20, color: 'info.main', mt: 0.2 }} />
              <Typography variant="caption" color="info.dark" lineHeight={1.5}>
                Это демо-урок. Данные показаны для примера.
              </Typography>
            </Box>
          )}

          {/* Footer Actions */}
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <LessonManagementMenu
              lesson={lesson}
              onDeleteLesson={handleDeleteLesson}
              onResetProgress={handleResetProgress}
            />
          </Box>
        </Box>
      </Box>

      {/* Modals */}
      {testData && (
        <TestModal
          open={isTestModalOpen}
          onClose={handleCloseTest}
          testData={testData}
        />
      )}

      <TestGenerationSettingsModal
        open={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onGenerate={(settings) => void handleOpenTest(settings)}
        isLoading={isLoadingTest}
      />

      <LessonDeleteDialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={() => void handleConfirmDelete()}
        lessonTitle={lesson?.title}
        isLoading={isDeletingLesson}
        error={deleteError}
      />

      <ResetProgressDialog
        open={isResetProgressDialogOpen}
        onClose={handleCloseResetProgressDialog}
        onConfirm={() => void handleConfirmResetProgress()}
        lessonTitle={lesson?.title}
        isLoading={isResettingProgress}
        error={resetProgressError}
      />
    </>
  );
};

