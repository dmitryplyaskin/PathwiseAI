import {
  IsUUID,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export class GenerateTestDto {
  @IsUUID()
  @IsNotEmpty()
  lessonId: string;

  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsNumber()
  @IsOptional()
  @Min(1, { message: 'Количество вопросов должно быть не менее 1' })
  @Max(50, { message: 'Количество вопросов не может превышать 50' })
  questionCount?: number = 5;
}
