import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Paper,
  Alert,
} from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';
import type { QuizQuestion as QuizQuestionType } from '../types';
import { MarkdownRenderer } from '@shared/ui/markdown-renderer';

interface QuizQuestionProps {
  question: QuizQuestionType;
  onAnswer: (isCorrect: boolean, answer: string) => void;
  isAnswered: boolean;
}

export const QuizQuestion = ({
  question,
  onAnswer,
  isAnswered,
}: QuizQuestionProps) => {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Сброс состояния при смене вопроса
  useEffect(() => {
    setSelectedOption('');
    setShowResult(false);
    setIsCorrect(false);
  }, [question.id]);

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isAnswered) {
      setSelectedOption(event.target.value);
    }
  };

  const handleSubmit = () => {
    if (!selectedOption) return;

    const selected = question.options.find((opt) => opt.id === selectedOption);
    if (selected) {
      const correct = selected.isCorrect;
      setIsCorrect(correct);
      setShowResult(true);
      onAnswer(correct, selected.text);
    }
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={600} mb={3}>
        {question.question}
      </Typography>

      {question.questionContent && (
        <Box mb={3}>
          <MarkdownRenderer showLineNumbers={true} maxCodeHeight="300px">
            {question.questionContent}
          </MarkdownRenderer>
        </Box>
      )}

      <RadioGroup value={selectedOption} onChange={handleOptionChange}>
        {question.options.map((option) => {
          const isSelected = selectedOption === option.id;
          const showCorrect = showResult && option.isCorrect;
          const showWrong = showResult && isSelected && !option.isCorrect;

          return (
            <Paper
              key={option.id}
              elevation={0}
              sx={{
                mb: 2,
                p: 2,
                border: '2px solid',
                borderColor: showCorrect
                  ? 'success.main'
                  : showWrong
                    ? 'error.main'
                    : isSelected
                      ? 'primary.main'
                      : 'grey.300',
                borderRadius: 2,
                cursor: isAnswered ? 'default' : 'pointer',
                opacity: isAnswered && !showCorrect && !showWrong ? 0.6 : 1,
                transition: 'border-color 0.3s ease, opacity 0.3s ease',
                '&:hover': {
                  borderColor:
                    isAnswered || showCorrect || showWrong
                      ? undefined
                      : 'primary.light',
                },
              }}
            >
              <FormControlLabel
                value={option.id}
                control={
                  <Radio
                    disabled={isAnswered}
                    icon={
                      showCorrect ? (
                        <CheckCircle color="success" />
                      ) : showWrong ? (
                        <Cancel color="error" />
                      ) : undefined
                    }
                    checkedIcon={
                      showCorrect ? (
                        <CheckCircle color="success" />
                      ) : showWrong ? (
                        <Cancel color="error" />
                      ) : undefined
                    }
                  />
                }
                label={
                  <Typography
                    fontWeight={isSelected ? 600 : 400}
                    color={
                      showCorrect
                        ? 'success.main'
                        : showWrong
                          ? 'error.main'
                          : 'text.primary'
                    }
                  >
                    {option.text}
                  </Typography>
                }
                sx={{ width: '100%', m: 0 }}
              />
            </Paper>
          );
        })}
      </RadioGroup>

      {showResult && (
        <Alert
          severity={isCorrect ? 'success' : 'error'}
          icon={isCorrect ? <CheckCircle /> : <Cancel />}
          sx={{ mt: 2 }}
        >
          {isCorrect
            ? 'Правильный ответ! Отлично!'
            : 'Неправильный ответ. Попробуйте еще раз в следующий раз.'}
        </Alert>
      )}

      {!showResult && (
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!selectedOption}
          sx={{ mt: 2 }}
        >
          Ответить
        </Button>
      )}
    </Box>
  );
};
