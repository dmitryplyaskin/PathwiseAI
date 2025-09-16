import { useState } from 'react';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Box,
  Stack,
  type SelectChangeEvent,
} from '@mui/material';
import { Modal } from '../../../shared/ui';

interface NewModuleModalProps {
  open: boolean;
  onClose: () => void;
}

type Complexity = 'simple' | 'normal' | 'professional' | '';

const complexityDescriptions: Record<string, string> = {
  simple:
    'Объяснение будет максимально простым, с использованием аналогии и базовых терминов. Отлично подходит для новичков.',
  normal:
    'Стандартное объяснение с использованием правильной терминологии, но без излишнего углубления в детали. Подходит для большинства.',
  professional:
    'Углубленное объяснение для специалистов, с использованием сложной терминологии, деталей реализации и пограничных случаев.',
  '': '',
};

export const NewModuleModal = ({ open, onClose }: NewModuleModalProps) => {
  const [topic, setTopic] = useState('');
  const [details, setDetails] = useState('');
  const [complexity, setComplexity] = useState<Complexity>('normal');

  const handleComplexityChange = (event: SelectChangeEvent) => {
    setComplexity(event.target.value as Complexity);
  };

  const handleSubmit = () => {
    console.log({
      topic,
      details,
      complexity,
    });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Изучить новый модуль">
      <Stack spacing={3} sx={{ pt: 1 }}>
        <TextField
          label="Какой вопрос вы хотите изучить?"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          fullWidth
          required
        />
        <TextField
          label="Опишите подробнее (опционально)"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          multiline
          rows={4}
          fullWidth
        />
        <FormControl fullWidth>
          <InputLabel id="complexity-select-label">
            Сложность объяснения
          </InputLabel>
          <Select
            labelId="complexity-select-label"
            value={complexity}
            label="Сложность объяснения"
            onChange={handleComplexityChange}
          >
            <MenuItem value="simple">Простой</MenuItem>
            <MenuItem value="normal">Обычный</MenuItem>
            <MenuItem value="professional">Профессиональный</MenuItem>
          </Select>
        </FormControl>

        {complexity && (
          <Box
            sx={{
              p: 2,
              backgroundColor: 'action.hover',
              borderRadius: 2,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {complexityDescriptions[complexity]}
            </Typography>
          </Box>
        )}

        <Box display="flex" justifyContent="flex-end" gap={2} sx={{ pt: 2 }}>
          <Button onClick={onClose} variant="outlined">
            Отмена
          </Button>
          <Button onClick={handleSubmit} variant="contained" disabled={!topic}>
            Создать
          </Button>
        </Box>
      </Stack>
    </Modal>
  );
};
