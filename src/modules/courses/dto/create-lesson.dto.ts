import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsEnum,
  IsOptional,
  IsDateString,
  IsNumber,
  IsUUID,
} from 'class-validator';
import { LessonStatus } from '../entities/lesson.entity';

export class CreateLessonDto {
  @IsUUID()
  @IsNotEmpty()
  unitId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsInt()
  @IsNotEmpty()
  order: number;
}
