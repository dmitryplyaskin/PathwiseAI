import { IsUUID, IsNotEmpty, IsString } from 'class-validator';

export class CheckTextAnswerDto {
  @IsUUID()
  @IsNotEmpty()
  questionId: string;

  @IsString()
  @IsNotEmpty()
  userAnswer: string;

  @IsString()
  @IsNotEmpty()
  expectedAnswer: string;

  @IsString()
  @IsNotEmpty()
  questionText: string;
}
