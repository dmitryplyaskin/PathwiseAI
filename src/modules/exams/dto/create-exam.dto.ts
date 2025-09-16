import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsNumber,
  IsDateString,
  IsUUID,
} from 'class-validator';
import { ExamStatus } from '../entities/exam.entity';

export class CreateExamDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  courseId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsEnum(ExamStatus)
  @IsOptional()
  status?: ExamStatus;

  @IsNumber()
  @IsOptional()
  score?: number;

  @IsDateString()
  @IsNotEmpty()
  started_at: string;

  @IsDateString()
  @IsOptional()
  completed_at?: string;
}
