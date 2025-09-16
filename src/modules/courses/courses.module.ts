import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesService } from './services/courses.service';
import { CoursesController } from './controllers/courses.controller';
import { Course } from './entities/course.entity';
import { Unit } from './entities/unit.entity';
import { Lesson } from './entities/lesson.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Course, Unit, Lesson])],
  controllers: [CoursesController],
  providers: [CoursesService],
})
export class CoursesModule {}
