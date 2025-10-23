import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomBytes } from 'crypto';

@Injectable()
export class CsrfTokenMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Генерируем CSRF токен если его нет
    let csrfToken: string | undefined = req.cookies?.['csrf-token'] as
      | string
      | undefined;

    if (!csrfToken) {
      csrfToken = randomBytes(32).toString('hex');
      res.cookie('csrf-token', csrfToken, {
        httpOnly: false, // Должен быть доступен для чтения JavaScript
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
      });
    }

    // Добавляем токен в заголовок ответа для удобства клиента
    if (csrfToken) {
      res.setHeader('X-CSRF-Token', csrfToken);
    }

    next();
  }
}
