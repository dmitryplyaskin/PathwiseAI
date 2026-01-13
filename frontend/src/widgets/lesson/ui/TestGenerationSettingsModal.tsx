import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Close,
  AutoAwesome,
  FormatListBulleted,
  Create,
  School,
  Speed,
  Shuffle,
} from '@mui/icons-material';

export interface TestGenerationSettings {
  mode: 'normal' | 'detailed';
  questionTypes: ('quiz' | 'text')[];
}

interface TestGenerationSettingsModalProps {
  open: boolean;
  onClose: () => void;
  onGenerate: (settings: TestGenerationSettings) => void;
  isLoading?: boolean;
}

type QuestionTypeOption = 'quiz' | 'mixed' | 'text';

export const TestGenerationSettingsModal = ({
  open,
  onClose,
  onGenerate,
  isLoading,
}: TestGenerationSettingsModalProps) => {
  const theme = useTheme();
  const [mode, setMode] = useState<'normal' | 'detailed'>('normal');
  const [questionType, setQuestionType] = useState<QuestionTypeOption>('mixed');

  const questionTypeHint =
    questionType === 'quiz'
      ? 'Только тестовые вопросы с выбором ответа.'
      : questionType === 'mixed'
        ? 'Смешанный режим: будут тестовые и письменные вопросы.'
        : 'Только письменные вопросы (развёрнутые ответы).';

  const handleGenerate = () => {
    let types: ('quiz' | 'text')[];
    switch (questionType) {
      case 'quiz':
        types = ['quiz'];
        break;
      case 'text':
        types = ['text'];
        break;
      case 'mixed':
      default:
        types = ['quiz', 'text'];
        break;
    }
    onGenerate({ mode, questionTypes: types });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 18px 44px rgba(15, 23, 42, 0.18)',
        },
      }}
    >
      <DialogTitle
        sx={{
          p: 2.5,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box display="flex" alignItems="center" gap={1.5}>
          <Box
            sx={{
              p: 0.75,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: 'primary.main',
              display: 'flex',
            }}
          >
            <AutoAwesome fontSize="small" />
          </Box>
          <Typography variant="h6" fontWeight={800}>
            Настройки теста
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5 }}>
        <Stack spacing={2.5}>
          <Box>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
              Режим генерации
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Box
                role="button"
                tabIndex={0}
                onClick={() => setMode('normal')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') setMode('normal');
                }}
                sx={{
                  flex: 1,
                  p: 2,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: mode === 'normal' ? 'primary.main' : 'divider',
                  bgcolor:
                    mode === 'normal'
                      ? alpha(theme.palette.primary.main, 0.06)
                      : 'background.paper',
                  cursor: 'pointer',
                  outline: 'none',
                  '&:hover': {
                    bgcolor:
                      mode === 'normal'
                        ? alpha(theme.palette.primary.main, 0.08)
                        : alpha(theme.palette.text.primary, 0.02),
                  },
                }}
              >
                <Box display="flex" alignItems="flex-start" gap={1.5}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: 2,
                      display: 'grid',
                      placeItems: 'center',
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: mode === 'normal' ? 'primary.main' : 'text.secondary',
                      flexShrink: 0,
                    }}
                  >
                    <Speed fontSize="small" />
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography fontWeight={800} sx={{ lineHeight: 1.2 }}>
                      Обычный
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      5 вопросов • быстрая проверка
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box
                role="button"
                tabIndex={0}
                onClick={() => setMode('detailed')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') setMode('detailed');
                }}
                sx={{
                  flex: 1,
                  p: 2,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: mode === 'detailed' ? 'primary.main' : 'divider',
                  bgcolor:
                    mode === 'detailed'
                      ? alpha(theme.palette.primary.main, 0.06)
                      : 'background.paper',
                  cursor: 'pointer',
                  outline: 'none',
                  '&:hover': {
                    bgcolor:
                      mode === 'detailed'
                        ? alpha(theme.palette.primary.main, 0.08)
                        : alpha(theme.palette.text.primary, 0.02),
                  },
                }}
              >
                <Box display="flex" alignItems="flex-start" gap={1.5}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: 2,
                      display: 'grid',
                      placeItems: 'center',
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color:
                        mode === 'detailed' ? 'primary.main' : 'text.secondary',
                      flexShrink: 0,
                    }}
                  >
                    <School fontSize="small" />
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography fontWeight={800} sx={{ lineHeight: 1.2 }}>
                      Подробный
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      10 вопросов • глубокая проработка
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Stack>
          </Box>

          <Box>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
              Типы вопросов
            </Typography>
            <ToggleButtonGroup
              fullWidth
              exclusive
              value={questionType}
              onChange={(_, value: QuestionTypeOption | null) => {
                if (value) setQuestionType(value);
              }}
              sx={{
                '& .MuiToggleButton-root': {
                  py: 1.2,
                  borderColor: 'divider',
                  textTransform: 'none',
                  fontWeight: 700,
                },
              }}
            >
              <ToggleButton value="quiz">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FormatListBulleted fontSize="small" />
                  Выбор ответа
                </Box>
              </ToggleButton>
              <ToggleButton value="mixed">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Shuffle fontSize="small" />
                  Смешанный
                </Box>
              </ToggleButton>
              <ToggleButton value="text">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Create fontSize="small" />
                  Письменный
                </Box>
              </ToggleButton>
            </ToggleButtonGroup>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              {questionTypeHint}
            </Typography>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2.5 }}>
        <Button
          onClick={onClose}
          color="inherit"
          sx={{ color: 'text.secondary' }}
        >
          Отмена
        </Button>
        <Button
          variant="contained"
          onClick={handleGenerate}
          disabled={isLoading}
          size="small"
        >
          {isLoading ? 'Генерация...' : 'Сгенерировать тест'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
