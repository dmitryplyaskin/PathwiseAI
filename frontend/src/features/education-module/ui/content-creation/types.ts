import type { ModuleComplexity } from '@shared/api/courses/types';

export interface FormContextProps {
  topic: string;
  details: string;
  complexity: ModuleComplexity | '';
}

export interface LessonFormState extends FormContextProps {
  courseId: string;
  newCourseName: string;
}

export type CourseFormState = FormContextProps;

export type TabType = 'lesson' | 'course';

export interface FormProps {
  isSubmitDisabled: boolean;
  onSubmit: () => void;
}
