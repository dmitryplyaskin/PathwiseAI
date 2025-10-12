import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from '../modules/users/entities/user.entity';
import { Course } from '../modules/courses/entities/course.entity';
import { Unit } from '../modules/courses/entities/unit.entity';
import { Lesson } from '../modules/courses/entities/lesson.entity';
import { UserSeedService } from './services/user-seed.service';
import { AccessControlService } from './services/access-control.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Course, Unit, Lesson]),
    ConfigModule,
  ],
  providers: [UserSeedService, AccessControlService],
  exports: [UserSeedService, AccessControlService],
})
export class SharedModule {}
