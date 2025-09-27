import { useState, useEffect } from 'react';
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
  CircularProgress,
  Alert,
} from '@mui/material';
import { useStore } from 'effector-react';
import { Modal } from '../../../shared/ui';
import {
  $coursesList,
  $coursesListLoading,
  $coursesListError,
  $moduleCreating,
  $moduleCreationError,
  $createdModule,
  loadCoursesList,
  createModule,
  resetCreationState,
} from '../../../shared/model/courses';
import type {
  ModuleComplexity,
  CourseListItem,
  CreateModuleResponse,
} from '../../../shared/api/courses/types';

interface NewModuleModalProps {
  open: boolean;
  onClose: () => void;
}

type Complexity = ModuleComplexity | '';

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
  // Effector stores
  const coursesList = useStore($coursesList) as CourseListItem[];
  const coursesListLoading = useStore($coursesListLoading) as boolean;
  const coursesListError = useStore($coursesListError) as string | null;
  const moduleCreating = useStore($moduleCreating) as boolean;
  const moduleCreationError = useStore($moduleCreationError) as string | null;
  const createdModule = useStore($createdModule) as CreateModuleResponse | null;

  const [topic, setTopic] = useState('');
  const [details, setDetails] = useState('');
  const [complexity, setComplexity] = useState<Complexity>('normal');
  const [courseId, setCourseId] = useState('');
  const [newCourseName, setNewCourseName] = useState('');

  // Load courses list when modal opens
  useEffect(() => {
    if (open && coursesList.length === 0) {
      loadCoursesList();
    }
  }, [open, coursesList.length]);

  // Handle successful module creation
  useEffect(() => {
    if (createdModule) {
      // Reset form
      setTopic('');
      setDetails('');
      setComplexity('normal');
      setCourseId('');
      setNewCourseName('');
      // Close modal
      onClose();
      // Reset creation state
      resetCreationState();
    }
  }, [createdModule, onClose]);

  // Reset creation state when modal closes
  useEffect(() => {
    if (!open) {
      resetCreationState();
    }
  }, [open]);

  const handleComplexityChange = (event: SelectChangeEvent) => {
    setComplexity(event.target.value as Complexity);
  };

  const handleCourseChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    console.log('value', value);
    setCourseId(value);
    if (value !== 'new') {
      setNewCourseName('');
    }
  };

  const handleSubmit = () => {
    if (!topic || !courseId || !complexity) return;

    createModule({
      topic,
      details: details || undefined,
      complexity: complexity as ModuleComplexity,
      courseId: courseId === 'new' ? undefined : courseId,
      newCourseName: courseId === 'new' ? newCourseName : undefined,
      userId: 'temp-user-id', // TODO: получать из контекста пользователя
    });
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
            disabled={coursesListLoading}
          >
            {coursesListLoading ? (
              <MenuItem disabled>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Загрузка курсов...
              </MenuItem>
            ) : (
              <>
                {coursesList.map((course) => (
                  <MenuItem key={course.id} value={course.id}>
                    {course.title}
                  </MenuItem>
                ))}
                {coursesList.length > 0 && <Divider />}
                <MenuItem
                  value="new"
                  sx={{
                    color: 'primary.main',
                    fontWeight: 600,
                  }}
                >
                  Создать новый курс
                </MenuItem>
              </>
            )}
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

        {(coursesListError || moduleCreationError) && (
          <Alert severity="error">
            {coursesListError || moduleCreationError}
          </Alert>
        )}

        <Box display="flex" justifyContent="flex-end" gap={2} sx={{ pt: 2 }}>
          <Button onClick={onClose} variant="outlined" size="small">
            Отмена
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={
              moduleCreating ||
              !topic ||
              !courseId ||
              (courseId === 'new' && !newCourseName.trim())
            }
            size="small"
            startIcon={
              moduleCreating ? <CircularProgress size={16} /> : undefined
            }
          >
            {moduleCreating ? 'Создание...' : 'Создать'}
          </Button>
        </Box>
      </Stack>
    </Modal>
  );
};
