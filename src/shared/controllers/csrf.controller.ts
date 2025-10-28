import { Controller, Get } from '@nestjs/common';
import { Public } from '../decorators/public.decorator';

@Controller('csrf-token')
export class CsrfController {
  @Get()
  @Public()
  getCsrfToken(): { success: boolean } {
    // Middleware уже добавит токен в заголовок ответа и cookie
    // Этот эндпоинт просто возвращает успешный ответ
    return { success: true };
  }
}
