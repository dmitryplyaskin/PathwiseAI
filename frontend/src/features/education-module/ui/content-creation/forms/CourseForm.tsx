import { Stack } from '@mui/material';
import { useCourseForm } from '../hooks';
import { CommonFormFields } from './CommonFormFields';

interface CourseFormProps {
  isSubmitDisabled?: boolean;
  onSubmit?: () => void;
  modalOpen?: boolean;
}

export const CourseForm = () => {
  const form = useCourseForm();

  return (
    <Stack spacing={3}>
      <CommonFormFields
        activeTab="course"
        topic={form.topic}
        onTopicChange={form.setTopic}
        details={form.details}
        onDetailsChange={form.setDetails}
        complexity={form.complexity}
        onComplexityChange={form.handleComplexityChange}
      />
    </Stack>
  );
};

export { useCourseForm };
export type { CourseFormProps };
