import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Card,
  CardContent,
  Chip,
  Stack,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import {
  Quiz,
  CheckCircle,
  Cancel,
  Schedule,
  TrendingUp,
} from '@mui/icons-material';
import { useCurrentUser } from '@shared/model/users/use-current-user';
import { testsApi } from '@shared/api/tests/api';
import type { ExamHistoryItem } from '@shared/api/tests/types';

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getStatusColor = (
  status: string,
): 'success' | 'warning' | 'error' | 'default' => {
  switch (status) {
    case 'completed':
      return 'success';
    case 'in_progress':
      return 'warning';
    case 'cancelled':
      return 'error';
    default:
      return 'default';
  }
};

const getStatusText = (status: string): string => {
  switch (status) {
    case 'completed':
      return 'Завершен';
    case 'in_progress':
      return 'В процессе';
    case 'cancelled':
      return 'Отменен';
    default:
      return 'Неизвестно';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle />;
    case 'in_progress':
      return <Schedule />;
    case 'cancelled':
      return <Cancel />;
    default:
      return <Quiz />;
  }
};

const getScoreColor = (score: number): 'success' | 'warning' | 'error' => {
  if (score >= 80) return 'success';
  if (score >= 50) return 'warning';
  return 'error';
};

export const TestHistoryPage = () => {
  const [exams, setExams] = useState<ExamHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userId } = useCurrentUser();

  useEffect(() => {
    const fetchExams = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        setError(null);
        const examsData = await testsApi.getUserExams({ userId });
        setExams(examsData);
      } catch (err) {
        console.error('Failed to fetch exam history:', err);
        setError(
          err instanceof Error
            ? err.message
            : 'Не удалось загрузить историю тестов',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, [userId]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '50vh',
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  const completedExams = exams.filter((exam) => exam.status === 'completed');
  const averageScore =
    completedExams.length > 0
      ? Math.round(
          completedExams.reduce((sum, exam) => sum + exam.score, 0) /
            completedExams.length,
        )
      : 0;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #f8fbff 0%, #eff6ff 50%, #dbeafe 100%)',
      }}
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Заголовок */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            fontWeight={700}
            color="text.primary"
            gutterBottom
          >
            История тестов
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Просмотр результатов прохождения тестов
          </Typography>
        </Box>

        {/* Статистика */}
        <Box
          display="grid"
          gridTemplateColumns={{
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)',
          }}
          gap={3}
          sx={{ mb: 4 }}
        >
          <Box>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'primary.100',
                textAlign: 'center',
              }}
            >
              <Quiz sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" fontWeight={700} color="text.primary">
                {exams.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Всего тестов
              </Typography>
            </Paper>
          </Box>

          <Box>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'success.100',
                textAlign: 'center',
              }}
            >
              <CheckCircle
                sx={{ fontSize: 40, color: 'success.main', mb: 1 }}
              />
              <Typography variant="h4" fontWeight={700} color="text.primary">
                {completedExams.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Завершено
              </Typography>
            </Paper>
          </Box>

          <Box>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'warning.100',
                textAlign: 'center',
              }}
            >
              <TrendingUp sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4" fontWeight={700} color="text.primary">
                {averageScore}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Средний балл
              </Typography>
            </Paper>
          </Box>

          <Box>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'info.100',
                textAlign: 'center',
              }}
            >
              <Schedule sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h4" fontWeight={700} color="text.primary">
                {exams.filter((exam) => exam.status === 'in_progress').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                В процессе
              </Typography>
            </Paper>
          </Box>
        </Box>

        {/* Список тестов */}
        {exams.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 6,
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'grey.200',
              textAlign: 'center',
            }}
          >
            <Quiz sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
            <Typography variant="h5" color="text.secondary" gutterBottom>
              История тестов пуста
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Пройдите тесты по урокам, чтобы увидеть результаты здесь
            </Typography>
          </Paper>
        ) : (
          <Stack spacing={3}>
            {exams.map((exam) => (
              <Card
                key={exam.id}
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'grey.200',
                  '&:hover': {
                    borderColor: 'primary.300',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.1)',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      mb: 2,
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" fontWeight={600} gutterBottom>
                        {exam.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Курс: {exam.course.title}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Chip
                        icon={getStatusIcon(exam.status)}
                        label={getStatusText(exam.status)}
                        color={getStatusColor(exam.status)}
                        size="small"
                      />
                      {exam.status === 'completed' && (
                        <Chip
                          label={`${Math.round(exam.score)}%`}
                          color={getScoreColor(exam.score)}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box
                    display="grid"
                    gridTemplateColumns={{ xs: '1fr', sm: 'repeat(2, 1fr)' }}
                    gap={2}
                  >
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Начато: {formatDate(exam.started_at)}
                      </Typography>
                    </Box>
                    {exam.completed_at && (
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Завершено: {formatDate(exam.completed_at)}
                        </Typography>
                      </Box>
                    )}
                    {exam.status === 'completed' && (
                      <>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Правильных ответов:{' '}
                            {exam.results.filter((r) => r.is_correct).length} из{' '}
                            {exam.results.length}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Балл: {Math.round(exam.score)}%
                          </Typography>
                        </Box>
                      </>
                    )}
                  </Box>

                  {exam.status === 'completed' && exam.results.length > 0 && (
                    <>
                      <Divider sx={{ my: 2 }} />
                      <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        gutterBottom
                      >
                        Детали ответов:
                      </Typography>
                      <Stack spacing={1}>
                        {exam.results.map((result) => (
                          <Box
                            key={result.id}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              p: 1,
                              borderRadius: 1,
                              bgcolor: result.is_correct
                                ? 'success.50'
                                : 'error.50',
                            }}
                          >
                            {result.is_correct ? (
                              <CheckCircle
                                sx={{ fontSize: 16, color: 'success.main' }}
                              />
                            ) : (
                              <Cancel
                                sx={{ fontSize: 16, color: 'error.main' }}
                              />
                            )}
                            <Typography variant="body2" sx={{ flex: 1 }}>
                              {result.question.question}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {result.user_answer}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Container>
    </Box>
  );
};
