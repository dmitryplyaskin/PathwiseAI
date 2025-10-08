import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  IconButton,
  Typography,
  Button,
  Stack,
  Alert,
  Slide,
  LinearProgress,
} from '@mui/material';
import { Close, NavigateNext, SkipNext } from '@mui/icons-material';
import type { TransitionProps } from '@mui/material/transitions';
import { forwardRef } from 'react';
import type {
  TestData,
  QuestionAnswer,
  TestResult as TestResultType,
} from '../types';
import { QuizQuestion } from './QuizQuestion';
import { TextQuestion } from './TextQuestion';
import { TestResult } from './TestResult';
import { testsApi } from '../../../shared/api/tests';
import { useCurrentUser } from '../../../shared/model';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface TestModalProps {
  open: boolean;
  onClose: () => void;
  testData: TestData;
}

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const TestModal = ({ open, onClose, testData }: TestModalProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuestionAnswer[]>([]);
  const [isQuestionAnswered, setIsQuestionAnswered] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [testCompleted, setTestCompleted] = useState(false);
  const [testResult, setTestResult] = useState<TestResultType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { userId } = useCurrentUser();

  const currentQuestion = testData.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === testData.questions.length - 1;
  const progress =
    ((currentQuestionIndex + 1) / testData.questions.length) * 100;

  // Таймер
  useEffect(() => {
    if (!open || testCompleted) return;

    const timer = setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [open, testCompleted]);

  // Сброс состояния при открытии
  useEffect(() => {
    if (open) {
      setCurrentQuestionIndex(0);
      setAnswers([]);
      setIsQuestionAnswered(false);
      setShowWarning(false);
      setTimeSpent(0);
      setTestCompleted(false);
      setTestResult(null);
      setIsSubmitting(false);
      setSubmitError(null);
    }
  }, [open]);

  const handleAnswer = (
    isCorrect: boolean,
    answer: string,
    explanation?: string,
  ) => {
    const newAnswer: QuestionAnswer = {
      questionId: currentQuestion.id,
      isCorrect,
      answer,
      llmExplanation: explanation,
    };

    setAnswers((prev) => [...prev, newAnswer]);
    setIsQuestionAnswered(true);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      finishTest();
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      setIsQuestionAnswered(false);
    }
  };

  const handleSkip = () => {
    const skippedAnswer: QuestionAnswer = {
      questionId: currentQuestion.id,
      isCorrect: false,
      answer: null,
    };

    setAnswers((prev) => [...prev, skippedAnswer]);

    if (isLastQuestion) {
      finishTest([...answers, skippedAnswer]);
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      setIsQuestionAnswered(false);
    }
  };

  const finishTest = async (finalAnswers?: QuestionAnswer[]) => {
    const answersToUse = finalAnswers || answers;
    const correctCount = answersToUse.filter((a) => a.isCorrect).length;

    const result: TestResultType = {
      totalQuestions: testData.questions.length,
      correctAnswers: correctCount,
      timeSpent,
      answers: answersToUse,
    };

    setTestResult(result);
    setTestCompleted(true);

    // Отправляем результаты на сервер
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await testsApi.submitTestResult({
        examId: testData.id,
        userId: userId ?? '',
        answers: answersToUse.map((answer) => ({
          questionId: answer.questionId,
          answer: answer.answer || '',
          isCorrect: answer.isCorrect,
          explanation: answer.llmExplanation,
        })),
        timeSpent: timeSpent.toString(),
      });

      console.log('Test results submitted successfully');
    } catch (error) {
      console.error('Failed to submit test results:', error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Не удалось сохранить результаты',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseAttempt = () => {
    if (!testCompleted) {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 5000);
    } else {
      onClose();
    }
  };

  const handleForceClose = () => {
    onClose();
  };

  if (testCompleted && testResult) {
    return (
      <Dialog
        open={open}
        onClose={onClose}
        fullScreen
        TransitionComponent={Transition}
      >
        <Box
          sx={{
            position: 'relative',
            height: '100vh',
            bgcolor: 'background.default',
          }}
        >
          <TestResult
            result={testResult}
            onClose={onClose}
            isSubmitting={isSubmitting}
            submitError={submitError}
          />
        </Box>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={handleCloseAttempt}
      fullScreen
      TransitionComponent={Transition}
    >
      <Box
        sx={{
          position: 'relative',
          height: '100vh',
          bgcolor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Хедер */}
        <Box
          sx={{
            p: 3,
            borderBottom: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            {/* Таймер */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                bgcolor: 'primary.50',
                px: 2,
                py: 1,
                borderRadius: 2,
              }}
            >
              <Typography variant="body2" fontWeight={600} color="primary.main">
                Время:
              </Typography>
              <Typography variant="h6" fontWeight={700} color="primary.main">
                {formatTime(timeSpent)}
              </Typography>
            </Box>

            {/* Заголовок */}
            <Typography variant="h5" fontWeight={700} textAlign="center">
              {testData.title}
            </Typography>

            {/* Кнопка закрытия */}
            <IconButton
              onClick={handleCloseAttempt}
              sx={{
                bgcolor: 'error.50',
                '&:hover': { bgcolor: 'error.100' },
              }}
            >
              <Close />
            </IconButton>
          </Stack>

          {/* Предупреждение о закрытии */}
          {showWarning && (
            <Alert
              severity="warning"
              onClose={handleForceClose}
              sx={{ mb: 2 }}
              action={
                <Button color="inherit" size="small" onClick={handleForceClose}>
                  Закрыть
                </Button>
              }
            >
              Если вы закроете тест сейчас, прохождение не будет засчитано.
              Нажмите "Закрыть" справа, чтобы выйти без сохранения.
            </Alert>
          )}

          {/* Прогресс */}
          <Box>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mb={1}
            >
              <Typography variant="body2" color="text.secondary">
                Вопрос {currentQuestionIndex + 1} из {testData.questions.length}
              </Typography>
              <Typography variant="body2" fontWeight={600} color="primary.main">
                {Math.round(progress)}%
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: 'primary.50',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                },
              }}
            />
          </Box>
        </Box>

        {/* Контент вопроса */}
        <DialogContent
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            maxWidth: 900,
            width: '100%',
            mx: 'auto',
            py: 4,
          }}
        >
          <Box sx={{ flex: 1, mb: 4 }}>
            {currentQuestion.type === 'quiz' ? (
              <QuizQuestion
                question={currentQuestion}
                onAnswer={handleAnswer}
                isAnswered={isQuestionAnswered}
              />
            ) : (
              <TextQuestion
                question={currentQuestion}
                onAnswer={handleAnswer}
                isAnswered={isQuestionAnswered}
              />
            )}
          </Box>

          {/* Кнопки управления */}
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="outlined"
              size="large"
              startIcon={<SkipNext />}
              onClick={handleSkip}
              disabled={isQuestionAnswered}
              sx={{ px: 4, py: 1.5 }}
            >
              Пропустить вопрос
            </Button>
            <Button
              variant="contained"
              size="large"
              endIcon={<NavigateNext />}
              onClick={handleNext}
              disabled={!isQuestionAnswered}
              sx={{ px: 4, py: 1.5 }}
            >
              {isLastQuestion ? 'Завершить тест' : 'Дальше'}
            </Button>
          </Stack>
        </DialogContent>
      </Box>
    </Dialog>
  );
};
