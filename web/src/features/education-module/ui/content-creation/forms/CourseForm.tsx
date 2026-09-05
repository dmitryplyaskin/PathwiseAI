import { Stack } from '@mui/material';
import { useCourseForm } from '../hooks';
import { CommonFormFields } from './CommonFormFields';

interface CourseFormProps {
  isSubmitDisabled?: boolean;
  onSubmit?: () => void;
  modalOpen?: boolean;
  form: ReturnType<typeof useCourseForm>;
}

export const CourseForm = ({ form }: CourseFormProps) => {
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

export type { CourseFormProps };
