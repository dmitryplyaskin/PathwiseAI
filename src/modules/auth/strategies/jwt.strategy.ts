import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/services/users.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // Сначала пытаемся получить токен из cookie
        (request: Request) => {
          return request?.cookies?.access_token;
        },
        // Если нет cookie, пытаемся получить из заголовка Authorization
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: any) {
    try {
      const user = await this.usersService.findOne(payload.sub);
      if (!user) {
        throw new UnauthorizedException();
      }
      // Добавляем роль из payload для быстрого доступа
      return {
        ...user,
        role: payload.role,
      };
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
