import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Response,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import type { Response as ExpressResponse } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Response({ passthrough: true }) res: ExpressResponse,
  ) {
    const result = await this.authService.register(registerDto);

    // Устанавливаем JWT токен в httpOnly cookie
    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 24 часа
    });

    // Возвращаем только данные пользователя без токена
    return {
      user: result.user,
    };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Request() req,
    @Response({ passthrough: true }) res: ExpressResponse,
  ) {
    const result = await this.authService.login(req.user);

    // Устанавливаем JWT токен в httpOnly cookie
    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 24 часа
    });

    // Возвращаем только данные пользователя без токена
    return {
      user: result.user,
    };
  }

  @Post('logout')
  async logout(@Response({ passthrough: true }) res: ExpressResponse) {
    // Очищаем cookie с токеном
    res.clearCookie('access_token');

    return {
      message: 'Успешный выход из системы',
    };
  }
}
