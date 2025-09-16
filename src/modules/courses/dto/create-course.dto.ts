import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsNumber,
  IsUUID,
} from 'class-validator';
import { CourseStatus } from '../entities/course.entity';

export class CreateCourseDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
