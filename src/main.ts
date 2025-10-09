import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

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
  });

  app.setGlobalPrefix('api');

  app.useStaticAssets(join(__dirname, '..', 'frontend', 'dist'), {
    index: ['index.html'],
  });

  app.use((req, res, next) => {
    if (req.originalUrl.startsWith('/api')) {
      return next();
    }
    res.sendFile(join(__dirname, '..', 'frontend', 'dist', 'index.html'));
  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
