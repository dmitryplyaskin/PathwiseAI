import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesService } from './services/courses.service';
import { UnitsService } from './services/units.service';
import { LessonsService } from './services/lessons.service';
import { CoursesController } from './controllers/courses.controller';
import { UnitsController } from './controllers/units.controller';
import { LessonsController } from './controllers/lessons.controller';
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
  controllers: [CoursesController, UnitsController, LessonsController],
  providers: [CoursesService, UnitsService, LessonsService],
  exports: [CoursesService, UnitsService, LessonsService],
})
export class CoursesModule {}
