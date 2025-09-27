import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsUUID,
} from 'class-validator';

export enum ModuleComplexity {
  SIMPLE = 'simple',
  NORMAL = 'normal',
  PROFESSIONAL = 'professional',
}

export class CreateModuleDto {
  @IsString()
  @IsNotEmpty()
  topic: string;

  @IsString()
  @IsOptional()
  details?: string;

  @IsEnum(ModuleComplexity)
  complexity: ModuleComplexity;

  @IsString()
  @IsOptional()
  courseId?: string;

  @IsString()
  @IsOptional()
  newCourseName?: string;

  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
