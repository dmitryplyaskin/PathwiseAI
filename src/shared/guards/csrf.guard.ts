import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class CsrfGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Проверяем, является ли эндпоинт публичным
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const method = request.method;

    // CSRF защита только для state-changing методов
    if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      return true;
    }

    // Проверка CSRF токена из заголовка
    const csrfToken = request.headers['x-csrf-token'] as string | undefined;
    const cookieCsrfToken = request.cookies?.['csrf-token'] as
      | string
      | undefined;

    if (!csrfToken || !cookieCsrfToken) {
      throw new ForbiddenException('CSRF токен отсутствует');
    }

    // Проверка соответствия токенов (double submit cookie pattern)
    if (csrfToken !== cookieCsrfToken) {
      throw new ForbiddenException('CSRF токен недействителен');
    }

    // Дополнительная проверка origin/referer для дополнительной защиты
    const origin = request.headers.origin;
    const referer = request.headers.referer;

    if (origin || referer) {
      const allowedOrigins = [
        'http://localhost:5173',
        'http://localhost:3000',
        process.env.FRONTEND_URL,
      ].filter(Boolean);

      const requestOrigin =
        origin || (referer ? new URL(referer).origin : null);

      if (requestOrigin && !allowedOrigins.includes(requestOrigin)) {
        throw new ForbiddenException('Недопустимый origin');
      }
    }

    return true;
  }
}
