import { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  Alert,
  CircularProgress,
} from '@mui/material';
import { CheckCircle, Error } from '@mui/icons-material';
import type { TextQuestion as TextQuestionType } from '../types';
import { testsApi } from '../../../shared/api/tests';

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
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!answer.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await testsApi.checkTextAnswer({
        questionId: question.id,
        userAnswer: answer,
        expectedAnswer: question.expectedAnswer || '',
        questionText: question.question,
      });

      setIsCorrect(result.isCorrect);
      setScore(result.score);
      setLlmExplanation(result.explanation);
      setFeedback(result.feedback);
      setShowResult(true);

      onAnswer(result.isCorrect, answer, result.explanation);
    } catch (err: unknown) {
      console.error('Failed to check text answer:', err);
      setError(
        err instanceof Error ? err.message : 'Не удалось проверить ответ',
      );

      // Fallback: считаем ответ правильным при ошибке
      setIsCorrect(true);
      setScore(70);
      setLlmExplanation('Ответ принят. Произошла ошибка при проверке.');
      setFeedback('Ваш ответ был принят.');
      setShowResult(true);

      onAnswer(true, answer, 'Ответ принят. Произошла ошибка при проверке.');
    } finally {
      setIsLoading(false);
    }
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

      {error && (
        <Alert
          severity="warning"
          icon={<Error />}
          sx={{ mb: 2, borderRadius: 2 }}
        >
          <Typography variant="body2">{error}</Typography>
        </Alert>
      )}

      {showResult && llmExplanation && (
        <Alert
          severity={isCorrect ? 'success' : 'info'}
          icon={isCorrect ? <CheckCircle /> : undefined}
          sx={{ mb: 2, borderRadius: 2 }}
        >
          <Typography variant="body2" fontWeight={600} mb={1}>
            Оценка: {score}%{' '}
            {isCorrect ? '(Правильно)' : '(Частично правильно)'}
          </Typography>
          <Typography variant="body2" mb={1}>
            <strong>Объяснение:</strong> {llmExplanation}
          </Typography>
          {feedback && (
            <Typography variant="body2">
              <strong>Обратная связь:</strong> {feedback}
            </Typography>
          )}
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
