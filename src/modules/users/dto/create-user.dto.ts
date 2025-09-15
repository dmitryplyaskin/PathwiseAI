import {
  IsString,
  IsInt,
  IsEnum,
  IsOptional,
  IsEmail,
  MinLength,
  IsNotEmpty,
} from 'class-validator';
import { UserGender } from '../entities/user.entity';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsInt()
  @IsNotEmpty()
  age: number;

  @IsEnum(UserGender)
  @IsNotEmpty()
  gender: UserGender;

  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  password: string;
}
