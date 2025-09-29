import { useState, useEffect, useCallback } from 'react';
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
  Dialog,
  DialogContent,
} from '@mui/material';
import { useUnit } from 'effector-react';
import { useNavigate } from 'react-router';
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
import type { ModuleComplexity } from '../../../shared/api/courses/types';
import { useCurrentUser } from '../../../shared/model/users';

interface NewModuleModalProps {
  open: boolean;
  onClose: () => void;
}

type Complexity = ModuleComplexity | '';

const COMPLEXITY_OPTIONS = [
  {
    value: 'simple' as const,
    label: 'Простой',
    description:
      'Объяснение будет максимально простым, с использованием аналогии и базовых терминов. Отлично подходит для новичков.',
  },
  {
    value: 'normal' as const,
    label: 'Обычный',
    description:
      'Стандартное объяснение с использованием правильной терминологии, но без излишнего углубления в детали. Подходит для большинства.',
  },
  {
    value: 'professional' as const,
    label: 'Профессиональный',
    description:
      'Углубленное объяснение для специалистов, с использованием сложной терминологии, деталей реализации и пограничных случаев.',
  },
] as const;

export const NewModuleModal = ({ open, onClose }: NewModuleModalProps) => {
  const navigate = useNavigate();

  // Effector stores with useUnit
  const {
    coursesList,
    coursesListLoading,
    coursesListError,
    moduleCreating,
    moduleCreationError,
    createdModule,
  } = useUnit({
    coursesList: $coursesList,
    coursesListLoading: $coursesListLoading,
    coursesListError: $coursesListError,
    moduleCreating: $moduleCreating,
    moduleCreationError: $moduleCreationError,
    createdModule: $createdModule,
  });

  // Current user
  const { userId, loading: userLoading, error: userError } = useCurrentUser();

  // Form state
  const [topic, setTopic] = useState('');
  const [details, setDetails] = useState('');
  const [complexity, setComplexity] = useState<Complexity>('normal');
  const [courseId, setCourseId] = useState('');
  const [newCourseName, setNewCourseName] = useState('');

  // Reset form to initial state
  const resetForm = useCallback(() => {
    setTopic('');
    setDetails('');
    setComplexity('normal');
    setCourseId('');
    setNewCourseName('');
  }, []);

  // Load courses list every time modal opens
  useEffect(() => {
    if (open) {
      loadCoursesList();
    }
  }, [open]);

  // Handle successful module creation and redirect
  useEffect(() => {
    if (createdModule) {
      resetForm();
      onClose();
      // Redirect to the created lesson
      navigate(
        `/courses/${createdModule.courseId}/lessons/${createdModule.lessonId}`,
      );
      // Reset creation state after navigation
      setTimeout(() => resetCreationState(), 100);
    }
  }, [createdModule, onClose, resetForm, navigate]);

  // Reset creation state when modal closes
  useEffect(() => {
    if (!open) {
      resetCreationState();
    }
  }, [open]);

  // Handlers
  const handleComplexityChange = useCallback((event: SelectChangeEvent) => {
    setComplexity(event.target.value as Complexity);
  }, []);

  const handleCourseChange = useCallback((event: SelectChangeEvent) => {
    const value = event.target.value;
    setCourseId(value);
    if (value !== 'new') {
      setNewCourseName('');
    }
  }, []);

  const handleSubmit = useCallback(() => {
    if (!topic || !courseId || !complexity || !userId) return;

    createModule({
      topic,
      details: details || undefined,
      complexity: complexity as ModuleComplexity,
      courseId: courseId === 'new' ? undefined : courseId,
      newCourseName: courseId === 'new' ? newCourseName : undefined,
      userId,
    });
  }, [topic, courseId, complexity, userId, details, newCourseName]);

  // Validation
  const isSubmitDisabled =
    moduleCreating ||
    userLoading ||
    !userId ||
    !topic.trim() ||
    !courseId ||
    (courseId === 'new' && !newCourseName.trim());

  const errorMessage = coursesListError || moduleCreationError || userError;

  return (
    <>
      <Modal
        open={open && !moduleCreating}
        onClose={onClose}
        title="Создать новый урок"
      >
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
                [
                  ...coursesList.map((course) => (
                    <MenuItem key={course.id} value={course.id}>
                      {course.title}
                    </MenuItem>
                  )),
                  coursesList.length > 0 && <Divider key="divider" />,
                  <MenuItem
                    key="new"
                    value="new"
                    sx={{
                      color: 'primary.main',
                      fontWeight: 600,
                    }}
                  >
                    Создать новый курс
                  </MenuItem>,
                ]
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
              {COMPLEXITY_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
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
                {
                  COMPLEXITY_OPTIONS.find((opt) => opt.value === complexity)
                    ?.description
                }
              </Typography>
            </Box>
          )}

          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

          <Box display="flex" justifyContent="flex-end" gap={2} sx={{ pt: 2 }}>
            <Button onClick={onClose} variant="outlined" size="small">
              Отмена
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={isSubmitDisabled}
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

      {/* Прелоадер во время создания урока */}
      <Dialog
        open={moduleCreating}
        PaperProps={{
          sx: {
            p: 4,
            borderRadius: 3,
            textAlign: 'center',
            minWidth: 320,
          },
        }}
      >
        <DialogContent>
          <Stack spacing={3} alignItems="center">
            <CircularProgress size={60} thickness={4} />
            <Typography variant="h6" fontWeight={600}>
              Создаем урок...
            </Typography>
            <Typography variant="body2" color="text.secondary">
              AI генерирует персонализированный контент
              <br />
              для вашего урока. Это займет несколько секунд.
            </Typography>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
};
