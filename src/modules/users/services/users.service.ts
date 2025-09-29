import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(
    createUserDto: CreateUserDto,
  ): Promise<Omit<User, 'password_hash'>> {
    // Проверка на существование email
    const existingEmail = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }

    // Проверка на существование username
    const existingUsername = await this.usersRepository.findOne({
      where: { username: createUserDto.username },
    });
    if (existingUsername) {
      throw new ConflictException('Username already exists');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...dtoRest } = createUserDto;

    const user = this.usersRepository.create({
      ...dtoRest,
      password_hash: hashedPassword,
    });

    const savedUser = await this.usersRepository.save(user);
    delete savedUser.password_hash;
    return savedUser;
  }

  async findAll(): Promise<Omit<User, 'password_hash'>[]> {
    const users = await this.usersRepository.find();
    users.forEach((user) => delete user.password_hash);
    return users;
  }

  async findOne(id: string): Promise<Omit<User, 'password_hash'>> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    delete user.password_hash;
    return user;
  }

  async findByUsername(username: string): Promise<Omit<User, 'password_hash'>> {
    const user = await this.usersRepository.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException(`User with username "${username}" not found`);
    }
    delete user.password_hash;
    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<Omit<User, 'password_hash'>> {
    // Проверяем существование пользователя
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    // Проверка на дубликаты email, если он обновляется
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingEmail = await this.usersRepository.findOne({
        where: { email: updateUserDto.email },
      });
      if (existingEmail) {
        throw new ConflictException('Email already exists');
      }
    }

    // Проверка на дубликаты username, если он обновляется
    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existingUsername = await this.usersRepository.findOne({
        where: { username: updateUserDto.username },
      });
      if (existingUsername) {
        throw new ConflictException('Username already exists');
      }
    }

    const { password, ...dtoRest } = updateUserDto;
    const updatePayload: Partial<User> = { ...dtoRest };

    if (password) {
      const salt = await bcrypt.genSalt();
      updatePayload.password_hash = await bcrypt.hash(password, salt);
    }

    await this.usersRepository.update(id, updatePayload);

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    await this.usersRepository.delete(id);
  }
}
