import { useMemo, useState } from 'react';
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
  Divider,
} from '@mui/material';
import { Modal } from '../../../shared/ui';

interface NewModuleModalProps {
  open: boolean;
  onClose: () => void;
}

type Complexity = 'simple' | 'normal' | 'professional' | '';

type CourseOption = {
  id: string;
  title: string;
};

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
  const mockCourses = useMemo<CourseOption[]>(
    () => [
      { id: 'intro-to-ai', title: 'Введение в AI' },
      { id: 'prompt-engineering', title: 'Промпт-инжиниринг' },
      { id: 'data-ethics', title: 'Этика данных' },
    ],
    [],
  );

  const [topic, setTopic] = useState('');
  const [details, setDetails] = useState('');
  const [complexity, setComplexity] = useState<Complexity>('normal');
  const [courseId, setCourseId] = useState('');
  const [newCourseName, setNewCourseName] = useState('');

  const handleComplexityChange = (event: SelectChangeEvent) => {
    setComplexity(event.target.value as Complexity);
  };

  const handleCourseChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    setCourseId(value);
    if (value !== 'new') {
      setNewCourseName('');
    }
  };

  const handleSubmit = () => {
    console.log({
      topic,
      details,
      complexity,
      course:
        courseId === 'new'
          ? { type: 'new', title: newCourseName }
          : { type: 'existing', id: courseId },
    });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Создать новый урок">
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
        <FormControl fullWidth required>
          <InputLabel id="course-select-label">Курс</InputLabel>
          <Select
            labelId="course-select-label"
            value={courseId}
            label="Курс"
            onChange={handleCourseChange}
          >
            {mockCourses.map((course) => (
              <MenuItem key={course.id} value={course.id}>
                {course.title}
              </MenuItem>
            ))}
            <Divider />
            <MenuItem
              value="new"
              sx={{
                color: 'primary.main',
                fontWeight: 600,
              }}
            >
              Создать новый курс
            </MenuItem>
          </Select>
        </FormControl>

        {courseId === 'new' && (
          <TextField
            label="Название нового курса"
            value={newCourseName}
            onChange={(e) => setNewCourseName(e.target.value)}
            fullWidth
            required
            autoFocus
          />
        )}
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
          <Button onClick={onClose} variant="outlined" size="small">
            Отмена
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={
              !topic ||
              !courseId ||
              (courseId === 'new' && !newCourseName.trim())
            }
            size="small"
          >
            Создать
          </Button>
        </Box>
      </Stack>
    </Modal>
  );
};
