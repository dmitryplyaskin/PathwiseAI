import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateCourseDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
