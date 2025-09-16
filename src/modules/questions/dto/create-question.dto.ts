import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsObject,
  IsUUID,
} from 'class-validator';
import { QuestionType } from '../entities/question.entity';

export class CreateQuestionDto {
  @IsUUID()
  @IsNotEmpty()
  lessonId: string;

  @IsString()
  @IsNotEmpty()
  question_text: string;

  @IsEnum(QuestionType)
  @IsNotEmpty()
  question_type: QuestionType;

  @IsObject()
  @IsOptional()
  options?: Record<string, any>;

  @IsString()
  @IsNotEmpty()
  correct_answer: string;

  @IsString()
  @IsOptional()
  explanation?: string;
}
