import {
  IsUUID,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsIn,
  IsArray,
  ArrayNotEmpty,
  ArrayUnique,
  IsBoolean,
} from 'class-validator';

export class GenerateTestDto {
  @IsUUID()
  @IsNotEmpty()
  lessonId: string;

  @IsInt()
  @IsOptional()
  @Min(5, { message: 'Количество вопросов должно быть не менее 5' })
  @Max(20, { message: 'Количество вопросов должно быть не более 20' })
  questionCount?: number = 5;

  @IsIn(['normal', 'detailed'])
  @IsOptional()
  mode?: 'normal' | 'detailed' = 'normal';

  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsIn(['quiz', 'text'], { each: true })
  @IsOptional()
  questionTypes?: ('quiz' | 'text')[] = ['quiz', 'text'];

  @IsBoolean()
  @IsOptional()
  forceNew?: boolean;
}
