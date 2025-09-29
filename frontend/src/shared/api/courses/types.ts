export interface CourseListItem {
  id: string;
  title: string;
}

export type ModuleComplexity = 'simple' | 'normal' | 'professional';

export interface CreateModuleRequest {
  topic: string;
  details?: string;
  complexity: ModuleComplexity;
  courseId?: string;
  newCourseName?: string;
  userId: string;
}

export interface CreateModuleResponse {
  courseId: string;
  lessonId: string;
  unitId: string;
  title: string;
  content: string;
}
