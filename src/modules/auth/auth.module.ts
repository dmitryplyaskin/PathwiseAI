import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
      useFactory: async (configService: ConfigService) => {
        const expiresIn = configService.get<string>('JWT_EXPIRES_IN');
        const signOptions: any = {};

        // Если JWT_EXPIRES_IN не установлен или равен 'never', токен не истекает
        if (expiresIn && expiresIn !== 'never') {
          signOptions.expiresIn = expiresIn;
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
