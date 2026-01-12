import {
  IsUUID,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsString,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class QuestionAnswerDto {
  @IsUUID()
  @IsNotEmpty()
  questionId: string;

  // Может быть пустым/отсутствовать, если вопрос пропущен.
  // В этом случае считается неправильным ответом (isCorrect=false).
  @IsOptional()
  @IsString()
  answer?: string;

  @IsBoolean()
  @IsNotEmpty()
  isCorrect: boolean;

  @IsString()
  @IsOptional()
  explanation?: string;
}

export class SubmitTestResultDto {
  @IsUUID()
  @IsNotEmpty()
  examId: string;

  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionAnswerDto)
  answers: QuestionAnswerDto[];

  @IsString()
  @IsNotEmpty()
  timeSpent: string; // в секундах
}
