import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/services/users.service';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import type { User } from '../../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(login: string, password: string): Promise<User | null> {
    try {
      // Получаем пользователя по email или username (включая password_hash)
      const user = await this.usersService.findByLoginForAuth(login);

      if (
        user &&
        user.password_hash &&
        (await bcrypt.compare(password, user.password_hash))
      ) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password_hash, ...result } = user;
        return result;
      }
      return null;
    } catch {
      return null;
    }
  }

  async login(user: User) {
    const payload = {
      email: user.email,
      sub: user.id,
      username: user.username,
      role: user.role,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        settings: user.settings,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    };
  }

  async register(userData: CreateUserDto) {
    const user = await this.usersService.create(userData);
    return this.login(user);
  }
}
