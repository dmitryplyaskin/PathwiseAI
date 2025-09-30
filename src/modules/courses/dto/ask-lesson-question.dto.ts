import { IsString, IsNotEmpty, IsUUID, IsOptional } from 'class-validator';

export class AskLessonQuestionDto {
  @IsUUID()
  @IsNotEmpty()
  lessonId: string;

  @IsUUID()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsNotEmpty()
  question: string;
}
