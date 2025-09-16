import {
  IsString,
  IsEmail,
  MinLength,
  IsNotEmpty,
  IsObject,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  password: string;

  @IsObject()
  @IsOptional()
  settings?: Record<string, any>;
}
