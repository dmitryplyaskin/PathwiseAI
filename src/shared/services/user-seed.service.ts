import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User } from '../../modules/users/entities/user.entity';

@Injectable()
export class UserSeedService implements OnModuleInit {
  private static isInitialized = false;

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    // Проверяем фичерфлаг
    const shouldCreateDefaultUser =
      this.configService.get<string>('CREATE_DEFAULT_USER') === 'true';

    if (!shouldCreateDefaultUser) {
      return;
    }

    // Проверяем, была ли инициализация уже выполнена
    if (UserSeedService.isInitialized) {
      console.log('Default user initialization already completed, skipping');
      return;
    }

    try {
      await this.createDefaultUserIfNotExists();
      UserSeedService.isInitialized = true;
    } catch (error) {
      console.error('Error during default user initialization:', error);
    }
  }

  private async createDefaultUserIfNotExists() {
    try {
      // Проверяем существование пользователя по нескольким критериям
      const existingUser = await this.usersRepository.findOne({
        where: [{ username: 'admin' }, { email: 'admin@pathwiseai.com' }],
      });

      if (existingUser) {
        console.log(
          'Default user already exists (found by username or email), skipping creation:',
          {
            id: existingUser.id,
            username: existingUser.username,
            email: existingUser.email,
          },
        );
        return;
      }

      // Проверяем общее количество пользователей (дополнительная защита)
      const userCount = await this.usersRepository.count();
      if (userCount > 0) {
        console.log(
          `Database already contains ${userCount} users, skipping default user creation`,
        );
        return;
      }

      console.log('Creating default user...');

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash('admin123', salt);

      const defaultUser = this.usersRepository.create({
        username: 'admin',
        email: 'admin@pathwiseai.com',
        password_hash: hashedPassword,
        settings: {
          theme: 'light',
          language: 'ru',
          notifications: true,
        },
      });

      const savedUser = await this.usersRepository.save(defaultUser);

      console.log('Default user created successfully:', {
        id: savedUser.id,
        username: savedUser.username,
        email: savedUser.email,
        created_at: savedUser.created_at,
      });
    } catch (error) {
      console.error('Error while checking or creating default user:', error);
      throw error; // Пробрасываем ошибку дальше для обработки в onModuleInit
    }
  }
}
