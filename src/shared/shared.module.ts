import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from '../modules/users/entities/user.entity';
import { UserSeedService } from './services/user-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ConfigModule],
  providers: [UserSeedService],
  exports: [UserSeedService],
})
export class SharedModule {}
