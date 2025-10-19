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

export interface CourseFormState extends FormContextProps {
  // Course form may have additional fields in future
}

export type TabType = 'lesson' | 'course';

export interface FormProps {
  isSubmitDisabled: boolean;
  onSubmit: () => void;
}
