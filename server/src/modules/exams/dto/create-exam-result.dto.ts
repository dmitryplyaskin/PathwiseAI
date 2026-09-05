import { IsString, IsNotEmpty, IsBoolean, IsUUID } from 'class-validator';

export class CreateExamResultDto {
  @IsUUID()
  @IsNotEmpty()
  examId: string;

  @IsUUID()
  @IsNotEmpty()
  questionId: string;

  @IsString()
  @IsNotEmpty()
  user_answer: string;

  @IsBoolean()
  @IsNotEmpty()
  is_correct: boolean;
}
