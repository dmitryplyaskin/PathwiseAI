import { IsString, IsNotEmpty, IsInt, IsUUID } from 'class-validator';

export class CreateUnitDto {
  @IsUUID()
  @IsNotEmpty()
  courseId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsInt()
  @IsNotEmpty()
  order: number;
}
