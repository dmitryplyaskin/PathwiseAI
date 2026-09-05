import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../../users/enums/user-role.enum';
import { CurrentUser } from '../decorators/current-user.decorator';
import type { User } from '../../users/entities/user.entity';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  @Roles(UserRole.ADMIN)
  @Get('dashboard')
  getAdminDashboard(@CurrentUser() user: User) {
    return {
      message: 'Добро пожаловать в админ панель!',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      adminFeatures: [
        'Управление пользователями',
        'Просмотр статистики',
        'Настройки системы',
      ],
    };
  }

  @Roles(UserRole.ADMIN, UserRole.USER)
  @Get('info')
  getAdminInfo(@CurrentUser() user: User) {
    return {
      message: 'Информация доступна всем авторизованным пользователям',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }
}
