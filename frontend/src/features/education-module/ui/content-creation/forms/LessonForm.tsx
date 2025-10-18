import {
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Divider,
  CircularProgress,
} from '@mui/material';
import { useUnit } from 'effector-react';
import { useLessonForm } from '../hooks';
import { CommonFormFields } from './CommonFormFields';
import {
  $coursesList,
  $coursesListLoading,
  loadCoursesList,
} from '../../../../../shared/model/courses';
import type { CourseListItem } from '../../../../../shared/api/courses/types';
import { useEffect } from 'react';

interface LessonFormProps {
  isSubmitDisabled?: boolean;
  onSubmit?: () => void;
  modalOpen: boolean;
}

export const LessonForm = ({ modalOpen }: LessonFormProps) => {
  const form = useLessonForm();
  const { coursesList, coursesListLoading } = useUnit({
    coursesList: $coursesList,
    coursesListLoading: $coursesListLoading,
  });

  // Load courses list when modal opens and this form is active
  useEffect(() => {
    if (modalOpen) {
      loadCoursesList();
    }
  }, [modalOpen]);

  // Expose form state and handlers through context or parent
  // For now, we'll handle this through the parent component
  return (
    <Stack spacing={3}>
      <CommonFormFields
        activeTab="lesson"
        topic={form.topic}
        onTopicChange={form.setTopic}
        details={form.details}
        onDetailsChange={form.setDetails}
        complexity={form.complexity}
        onComplexityChange={form.handleComplexityChange}
      />

      {/* Lesson-specific fields */}
      <FormControl fullWidth required>
        <InputLabel id="course-select-label">Курс</InputLabel>
        <Select
          labelId="course-select-label"
          value={form.courseId}
          label="Курс"
          onChange={form.handleCourseChange}
          disabled={coursesListLoading}
        >
          {coursesListLoading ? (
            <MenuItem disabled>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              Загрузка курсов...
            </MenuItem>
          ) : (
            [
              ...coursesList.map((course: CourseListItem) => (
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

      {form.courseId === 'new' && (
        <TextField
          label="Название нового курса"
          value={form.newCourseName}
          onChange={(e) => form.setNewCourseName(e.target.value)}
          fullWidth
          required
          autoFocus
        />
      )}
    </Stack>
  );
};

export { useLessonForm };
export type { LessonFormProps };
