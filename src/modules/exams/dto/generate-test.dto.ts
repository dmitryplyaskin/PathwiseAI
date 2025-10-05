import { IsUUID, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class GenerateTestDto {
  @IsUUID()
  @IsNotEmpty()
  lessonId: string;

  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsNumber()
  @IsOptional()
  questionCount?: number = 5;
}
