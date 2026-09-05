import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import type { SignOptions } from 'jsonwebtoken';
import { AuthController } from './controllers/auth.controller';
import { ProfileController } from './controllers/profile.controller';
import { AdminController } from './controllers/admin.controller';
import { AuthService } from './services/auth.service';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const expiresIn = configService.get<string>('JWT_EXPIRES_IN');
        const signOptions: SignOptions = {};

        // Если JWT_EXPIRES_IN не установлен или равен 'never', токен не истекает
        if (expiresIn && expiresIn !== 'never') {
          // jsonwebtoken typings accept either a number (seconds) or a time-span string (e.g. "15m", "1d")
          const normalized: SignOptions['expiresIn'] | undefined = /^\d+$/.test(
            expiresIn,
          )
            ? Number(expiresIn)
            : /^\d+(ms|s|m|h|d|w|y)$/.test(expiresIn)
              ? (expiresIn as unknown as SignOptions['expiresIn'])
              : undefined;

          if (!normalized) {
            throw new Error(
              `Invalid JWT_EXPIRES_IN value: "${expiresIn}". Expected number of seconds or a time span like "15m", "1d", or "never".`,
            );
          }

          signOptions.expiresIn = normalized;
        }

        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions,
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController, ProfileController, AdminController],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
