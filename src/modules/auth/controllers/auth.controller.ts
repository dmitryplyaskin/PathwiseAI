import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Response,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import type {
  Response as ExpressResponse,
  Request as ExpressRequest,
} from 'express';
import type { CookieOptions } from 'express';
import type { User } from '../../users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Response({ passthrough: true }) res: ExpressResponse,
  ) {
    const result = await this.authService.register(registerDto);

    // Получаем настройки времени жизни токена
    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN');
    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // Изменено с 'strict' на 'lax' для лучшей совместимости
      path: '/', // Явно указываем путь
    };

    // Если токен не истекает, не устанавливаем maxAge для cookie
    if (expiresIn && expiresIn !== 'never') {
      cookieOptions.maxAge = 24 * 60 * 60 * 1000; // 24 часа по умолчанию
    }

    // Устанавливаем JWT токен в httpOnly cookie
    res.cookie('access_token', result.access_token, cookieOptions);

    // Возвращаем только данные пользователя без токена
    return {
      user: result.user,
    };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Request() req: ExpressRequest & { user: User },
    @Response({ passthrough: true }) res: ExpressResponse,
  ) {
    const result = await this.authService.login(req.user);

    // Получаем настройки времени жизни токена
    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN');
    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // Изменено с 'strict' на 'lax' для лучшей совместимости
      path: '/', // Явно указываем путь
    };

    // Если токен не истекает, не устанавливаем maxAge для cookie
    if (expiresIn && expiresIn !== 'never') {
      cookieOptions.maxAge = 24 * 60 * 60 * 1000; // 24 часа по умолчанию
    }

    // Устанавливаем JWT токен в httpOnly cookie
    res.cookie('access_token', result.access_token, cookieOptions);

    // Возвращаем только данные пользователя без токена
    return {
      user: result.user,
    };
  }

  @Post('logout')
  logout(@Response({ passthrough: true }) res: ExpressResponse) {
    // Очищаем cookie с токеном
    res.clearCookie('access_token');

    return {
      message: 'Успешный выход из системы',
    };
  }
}
