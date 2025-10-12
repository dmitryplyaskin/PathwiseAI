import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsUUID,
  IsOptional,
  IsBoolean,
} from 'class-validator';

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

  @IsOptional()
  @IsBoolean()
  shared?: boolean;
}
