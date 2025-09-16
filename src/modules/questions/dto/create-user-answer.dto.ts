import { IsString, IsNotEmpty, IsBoolean, IsUUID } from 'class-validator';

export class CreateUserAnswerDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  questionId: string;

  @IsString()
  @IsNotEmpty()
  answer_text: string;

  @IsBoolean()
  @IsNotEmpty()
  is_correct: boolean;
}
