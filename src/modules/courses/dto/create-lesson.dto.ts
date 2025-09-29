import { IsString, IsNotEmpty, IsInt, IsUUID } from 'class-validator';

export class CreateLessonDto {
  @IsUUID()
  @IsNotEmpty()
  unitId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsInt()
  @IsNotEmpty()
  order: number;
}
