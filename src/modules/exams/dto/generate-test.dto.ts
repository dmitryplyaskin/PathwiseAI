import { IsUUID, IsNotEmpty, IsOptional, IsNumber, Min } from 'class-validator';

export class GenerateTestDto {
  @IsUUID()
  @IsNotEmpty()
  lessonId: string;

  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsNumber()
  @IsOptional()
  @Min(5, { message: 'Количество вопросов должно быть не менее 5' })
  questionCount?: number = 5;

  @IsOptional()
  mode?: 'normal' | 'detailed' = 'normal';

  @IsOptional()
  questionTypes?: ('quiz' | 'text')[] = ['quiz', 'text'];

  @IsOptional()
  forceNew?: boolean;
}
