import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesService } from './services/courses.service';
import { UnitsService } from './services/units.service';
import { LessonsService } from './services/lessons.service';
import { CoursesController } from './controllers/courses.controller';
import { Course } from './entities/course.entity';
import { Unit } from './entities/unit.entity';
import { Lesson } from './entities/lesson.entity';
import { ChatModule } from '../chat/chat.module';
import { SharedModule } from '../../shared/shared.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course, Unit, Lesson]),
    ChatModule,
    SharedModule,
  ],
  controllers: [CoursesController],
  providers: [CoursesService, UnitsService, LessonsService],
  exports: [CoursesService, UnitsService, LessonsService],
})
export class CoursesModule {}
