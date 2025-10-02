import { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  Alert,
  CircularProgress,
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import type { TextQuestion as TextQuestionType } from '../types';

interface TextQuestionProps {
  question: TextQuestionType;
  onAnswer: (isCorrect: boolean, answer: string, explanation?: string) => void;
  isAnswered: boolean;
}

export const TextQuestion = ({
  question,
  onAnswer,
  isAnswered,
}: TextQuestionProps) => {
  const [answer, setAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [llmExplanation, setLlmExplanation] = useState('');

  const handleSubmit = async () => {
    if (!answer.trim()) return;

    setIsLoading(true);

    // Заглушка для проверки LLM - всегда возвращает правильный ответ
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const mockExplanation =
      'Отличный ответ! Вы правильно описали ключевые концепции. Ваше понимание темы демонстрирует глубокое знание материала.';

    setLlmExplanation(mockExplanation);
    setShowResult(true);
    setIsLoading(false);

    onAnswer(true, answer, mockExplanation);
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={600} mb={3}>
        {question.question}
      </Typography>

      <TextField
        multiline
        rows={6}
        fullWidth
        placeholder="Введите ваш ответ здесь..."
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        disabled={isAnswered || isLoading}
        sx={{
          mb: 2,
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
          },
        }}
      />

      {showResult && llmExplanation && (
        <Alert
          severity="success"
          icon={<CheckCircle />}
          sx={{ mb: 2, borderRadius: 2 }}
        >
          <Typography variant="body2" fontWeight={600} mb={1}>
            Оценка вашего ответа:
          </Typography>
          <Typography variant="body2">{llmExplanation}</Typography>
        </Alert>
      )}

      {!showResult && (
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!answer.trim() || isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : undefined}
          sx={{ mt: 1 }}
        >
          {isLoading ? 'Проверка ответа...' : 'Проверить ответ'}
        </Button>
      )}
    </Box>
  );
};
