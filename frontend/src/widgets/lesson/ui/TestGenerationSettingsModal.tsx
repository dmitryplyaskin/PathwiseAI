import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Radio,
  Stack,
  IconButton,
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
          boxShadow: '0 24px 48px rgba(0, 0, 0, 0.2)',
        },
      }}
    >
      <DialogTitle
        sx={{
          p: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box display="flex" alignItems="center" gap={1.5}>
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: 'primary.main',
              display: 'flex',
            }}
          >
            <AutoAwesome />
          </Box>
          <Typography variant="h6" fontWeight={700}>
            Настройки теста
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        <Stack spacing={4}>
          {/* Mode Selection */}
          <Box>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              fontWeight={600}
              mb={2}
              textTransform="uppercase"
              letterSpacing={0.5}
            >
              Режим генерации
            </Typography>
            <Stack spacing={2}>
              <PaperOption
                selected={mode === 'normal'}
                onClick={() => setMode('normal')}
                icon={<Speed />}
                title="Обычный"
                description="Стандартный тест из 5 вопросов для быстрой проверки знаний."
              />
              <PaperOption
                selected={mode === 'detailed'}
                onClick={() => setMode('detailed')}
                icon={<School />}
                title="Подробный"
                description="Углубленный тест из 10 вопросов для детальной проработки материала."
              />
            </Stack>
          </Box>

          {/* Question Types */}
          <Box>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              fontWeight={600}
              mb={2}
              textTransform="uppercase"
              letterSpacing={0.5}
            >
              Типы вопросов
            </Typography>
            <Stack direction="row" spacing={2}>
              <TypeCard
                icon={<FormatListBulleted />}
                label="Выбор ответа"
                selected={questionType === 'quiz'}
                onClick={() => setQuestionType('quiz')}
              />
              <TypeCard
                icon={<Shuffle />}
                label="Смешанный"
                selected={questionType === 'mixed'}
                onClick={() => setQuestionType('mixed')}
              />
              <TypeCard
                icon={<Create />}
                label="Письменный"
                selected={questionType === 'text'}
                onClick={() => setQuestionType('text')}
              />
            </Stack>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} color="inherit" sx={{ borderRadius: 2 }}>
          Отмена
        </Button>
        <Button
          variant="contained"
          onClick={handleGenerate}
          disabled={isLoading}
          sx={{
            borderRadius: 2,
            px: 4,
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)',
          }}
        >
          {isLoading ? 'Генерация...' : 'Сгенерировать тест'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Helper components
const PaperOption = ({
  selected,
  onClick,
  icon,
  title,
  description,
}: {
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  const theme = useTheme();
  return (
    <Box
      onClick={onClick}
      sx={{
        p: 2,
        borderRadius: 3,
        border: '2px solid',
        borderColor: selected ? 'primary.main' : 'divider',
        bgcolor: selected ? alpha(theme.palette.primary.main, 0.04) : 'background.paper',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 2,
        '&:hover': {
          borderColor: selected ? 'primary.main' : 'divider',
          bgcolor: selected ? alpha(theme.palette.primary.main, 0.08) : 'action.hover',
        },
      }}
    >
      <Radio
        checked={selected}
        sx={{ p: 0, mt: 0.5 }}
        disableRipple
      />
      <Box flex={1}>
        <Box display="flex" alignItems="center" gap={1} mb={0.5}>
          <Box sx={{ color: selected ? 'primary.main' : 'text.secondary' }}>
            {icon}
          </Box>
          <Typography
            variant="subtitle1"
            fontWeight={700}
            color={selected ? 'primary.main' : 'text.primary'}
          >
            {title}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" lineHeight={1.4}>
          {description}
        </Typography>
      </Box>
    </Box>
  );
};

const TypeCard = ({
  icon,
  label,
  selected,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  selected: boolean;
  onClick: () => void;
}) => {
  const theme = useTheme();
  return (
    <Box
      onClick={onClick}
      sx={{
        flex: 1,
        p: 2,
        borderRadius: 3,
        border: '2px solid',
        borderColor: selected ? 'primary.main' : 'divider',
        bgcolor: selected ? alpha(theme.palette.primary.main, 0.04) : 'background.paper',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1.5,
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: selected ? 'primary.main' : 'divider',
          bgcolor: selected ? alpha(theme.palette.primary.main, 0.08) : 'action.hover',
        },
      }}
    >
      <Box
        sx={{
          color: selected ? 'primary.main' : 'text.secondary',
          display: 'flex',
          '& svg': { fontSize: 28 },
        }}
      >
        {icon}
      </Box>
      <Typography
        variant="body2"
        fontWeight={700}
        color={selected ? 'primary.main' : 'text.primary'}
        align="center"
      >
        {label}
      </Typography>
    </Box>
  );
};
