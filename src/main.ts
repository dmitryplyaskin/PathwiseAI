import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  // Валидация критических переменных окружения перед запуском приложения
  const tempApp = await NestFactory.createApplicationContext(AppModule, {
    logger: false,
  });
  const configService = tempApp.get(ConfigService);
  const jwtSecret = configService.get<string>('JWT_SECRET');

  if (!jwtSecret) {
    // Используем console.error для критических ошибок до инициализации logger
    console.error('ОШИБКА: JWT_SECRET не установлен в переменных окружения');
    console.error('Приложение не может быть запущено без JWT_SECRET');
    await tempApp.close();
    process.exit(1);
  }

  await tempApp.close();

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  // Получаем logger из приложения и настраиваем его
  const logger = app.get(Logger);
  app.useLogger(logger);

  // Подключаем cookie-parser для работы с httpOnly cookies
  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Настраиваем CORS для работы с cookies
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3000'], // Добавляем фронтенд URL
    credentials: true, // Важно для работы с cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-CSRF-Token'],
  });

  app.setGlobalPrefix('api');

  app.useStaticAssets(join(__dirname, '..', 'frontend', 'dist'), {
    index: ['index.html'],
  });

  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.originalUrl.startsWith('/api')) {
      return next();
    }
    res.sendFile(join(__dirname, '..', 'frontend', 'dist', 'index.html'));
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
}

bootstrap().catch((error: Error) => {
  // Используем console.error для критических ошибок до инициализации logger
  console.error('Failed to start application:', error);
  process.exit(1);
});
