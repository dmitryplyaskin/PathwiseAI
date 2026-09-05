export class CourseListItemDto {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  progress: number;
  unitsCount: number;
  completedUnits: number;
  totalLessons: number;
  completedLessons: number;
  lastStudied: string;
  status: 'completed' | 'in_progress' | 'not_started';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  category: 'machine_learning' | 'data_science' | 'programming' | 'mathematics';
  tags: string[];
  rating: number;
  studentsCount: number;
  instructor: string;
  thumbnail: string;
}
