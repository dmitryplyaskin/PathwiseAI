import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class AskLessonQuestionDto {
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
