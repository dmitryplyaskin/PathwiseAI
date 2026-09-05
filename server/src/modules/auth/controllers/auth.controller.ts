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
import { Public } from '../../../shared/decorators/public.decorator';
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

  @Public()
  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Response({ passthrough: true }) res: ExpressResponse,
  ) {
    const result = await this.authService.register(registerDto);
    const cookieOptions = this.buildAuthCookieOptions();

    // Устанавливаем JWT токен в httpOnly cookie
    res.cookie('access_token', result.access_token, cookieOptions);

    // Возвращаем только данные пользователя без токена
    return {
      user: result.user,
    };
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Request() req: ExpressRequest & { user: User },
    @Response({ passthrough: true }) res: ExpressResponse,
  ) {
    const result = await this.authService.login(req.user);
    const cookieOptions = this.buildAuthCookieOptions();

    // Устанавливаем JWT токен в httpOnly cookie
    res.cookie('access_token', result.access_token, cookieOptions);

    // Возвращаем только данные пользователя без токена
    return {
      user: result.user,
    };
  }

  @Public()
  @Post('logout')
  logout(@Response({ passthrough: true }) res: ExpressResponse) {
    // Очищаем cookie с токеном
    res.clearCookie('access_token', this.buildAuthCookieOptions());

    return {
      message: 'Успешный выход из системы',
    };
  }

  private buildAuthCookieOptions(): CookieOptions {
    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    };

    const maxAge = this.parseJwtExpiresInToMs(
      this.configService.get<string>('JWT_EXPIRES_IN'),
    );
    if (maxAge !== null) {
      cookieOptions.maxAge = maxAge;
    }

    return cookieOptions;
  }

  private parseJwtExpiresInToMs(expiresIn?: string): number | null {
    if (!expiresIn || expiresIn === 'never') {
      return null;
    }

    if (/^\d+$/.test(expiresIn)) {
      return Number(expiresIn) * 1000;
    }

    const match = expiresIn.match(/^(\d+)(ms|s|m|h|d|w|y)$/);
    if (!match) {
      return null;
    }

    const value = Number(match[1]);
    const unit = match[2];
    const multipliers: Record<string, number> = {
      ms: 1,
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
      w: 7 * 24 * 60 * 60 * 1000,
      y: 365 * 24 * 60 * 60 * 1000,
    };

    return value * multipliers[unit];
  }
}
