import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/services/users.service';
import { Request } from 'express';
import { UserRole } from '../../users/enums/user-role.enum';
import type { User } from '../../users/entities/user.entity';

interface JwtPayload {
  sub: string;
  email: string;
  username: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

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

    const expiresIn = configService.get<string>('JWT_EXPIRES_IN');

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // Сначала пытаемся получить токен из cookie
        (request: Request) => {
          const cookies = request.cookies as
            | undefined
            | Record<string, unknown>;
          const token = cookies?.['access_token'];
          return typeof token === 'string' ? token : null;
        },
        // Если нет cookie, пытаемся получить из заголовка Authorization
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: expiresIn === 'never',
      secretOrKey: secret,
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    try {
      const user = await this.usersService.findOne(payload.sub);
      if (!user) {
        throw new UnauthorizedException();
      }
      // Prefer DB as the source of truth for roles/permissions.
      return user as User;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
