import { IsString, IsNotEmpty, IsUUID, IsOptional } from 'class-validator';

export class AskLessonQuestionDto {
  @IsUUID()
  @IsNotEmpty()
  lessonId: string;

  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  question: string;

  @IsString()
  @IsOptional()
  threadId?: string;

  @IsString()
  @IsOptional()
  lessonContent?: string;
}
