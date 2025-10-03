import { Box, Button, Typography, Paper } from '@mui/material';
import {
  SentimentVerySatisfied,
  SentimentSatisfied,
  SentimentDissatisfied,
} from '@mui/icons-material';
import type { TestResult as TestResultType } from '../types';

interface TestResultProps {
  result: TestResultType;
  onClose: () => void;
}

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const getEmotionIcon = (percentage: number) => {
  if (percentage >= 80) {
    return (
      <SentimentVerySatisfied sx={{ fontSize: 120, color: 'success.main' }} />
    );
  } else if (percentage >= 50) {
    return <SentimentSatisfied sx={{ fontSize: 120, color: 'warning.main' }} />;
  } else {
    return (
      <SentimentDissatisfied sx={{ fontSize: 120, color: 'error.main' }} />
    );
  }
};

const getMessage = (percentage: number): string => {
  if (percentage >= 80) {
    return 'Отличная работа!';
  } else if (percentage >= 50) {
    return 'Хороший результат!';
  } else {
    return 'Попробуйте еще раз!';
  }
};

export const TestResult = ({ result, onClose }: TestResultProps) => {
  const percentage = Math.round(
    (result.correctAnswers / result.totalQuestions) * 100,
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        p: 4,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 6,
          borderRadius: 4,
          textAlign: 'center',
          maxWidth: 600,
          width: '100%',
          border: '2px solid',
          borderColor: 'primary.100',
        }}
      >
        {/* Иконка эмоции */}
        <Box mb={3}>{getEmotionIcon(percentage)}</Box>

        {/* Сообщение */}
        <Typography variant="h3" fontWeight={700} mb={2}>
          {getMessage(percentage)}
        </Typography>

        {/* Результаты */}
        <Typography variant="h4" color="text.secondary" mb={4}>
          Ваш результат: {result.correctAnswers} из {result.totalQuestions}
        </Typography>

        {/* Процент */}
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 150,
            height: 150,
            borderRadius: '50%',
            border: '8px solid',
            borderColor:
              percentage >= 80
                ? 'success.main'
                : percentage >= 50
                  ? 'warning.main'
                  : 'error.main',
            mb: 4,
          }}
        >
          <Typography variant="h2" fontWeight={700}>
            {percentage}%
          </Typography>
        </Box>

        {/* Время */}
        <Typography variant="body1" color="text.secondary" mb={4}>
          Время прохождения: {formatTime(result.timeSpent)}
        </Typography>

        {/* Кнопка закрытия */}
        <Button
          variant="contained"
          size="large"
          onClick={onClose}
          sx={{
            py: 2,
            px: 6,
            borderRadius: 2,
            fontWeight: 600,
            fontSize: '1.1rem',
          }}
        >
          Закрыть тестирование
        </Button>
      </Paper>
    </Box>
  );
};

