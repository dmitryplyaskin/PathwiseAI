import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
} from 'class-validator';

export enum CourseComplexity {
  SIMPLE = 'simple',
  NORMAL = 'normal',
  PROFESSIONAL = 'professional',
}

export class CreateCourseOutlineDto {
  @IsString()
  @IsNotEmpty()
  topic: string;

  @IsString()
  @IsOptional()
  details?: string;

  @IsEnum(CourseComplexity)
  complexity: CourseComplexity;
}
