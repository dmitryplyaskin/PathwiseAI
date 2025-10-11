import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  login: string; // Может быть email или username

  @IsString()
  @IsNotEmpty()
  password: string;
}
