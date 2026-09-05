import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../../modules/courses/entities/course.entity';
import { Unit } from '../../modules/courses/entities/unit.entity';
import { Lesson } from '../../modules/courses/entities/lesson.entity';

@Injectable()
export class AccessControlService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(Unit)
    private unitRepository: Repository<Unit>,
    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,
  ) {}

  async checkCourseAccess(courseId: string, userId: string): Promise<boolean> {
    const course = await this.courseRepository.findOne({
      where: { id: courseId },
      relations: ['user'],
    });

    if (!course) {
      return false;
    }

    // Доступ есть если пользователь владелец или курс общий
    return course.user.id === userId || course.shared;
  }

  async checkUnitAccess(unitId: string, userId: string): Promise<boolean> {
    const unit = await this.unitRepository.findOne({
      where: { id: unitId },
      relations: ['user', 'course'],
    });

    if (!unit) {
      return false;
    }

    // Доступ есть если пользователь владелец или юнит общий
    return unit.user.id === userId || unit.shared;
  }

  async checkLessonAccess(lessonId: string, userId: string): Promise<boolean> {
    const lesson = await this.lessonRepository.findOne({
      where: { id: lessonId },
      relations: ['user', 'unit', 'unit.course'],
    });

    if (!lesson) {
      return false;
    }

    // Доступ есть если пользователь владелец или урок общий
    return lesson.user.id === userId || lesson.shared;
  }

  async getAccessibleCourses(userId: string): Promise<Course[]> {
    return this.courseRepository.find({
      where: [{ user: { id: userId } }, { shared: true }],
      relations: ['user'],
    });
  }

  async getAccessibleUnits(userId: string): Promise<Unit[]> {
    return this.unitRepository.find({
      where: [{ user: { id: userId } }, { shared: true }],
      relations: ['user', 'course'],
    });
  }

  async getAccessibleLessons(userId: string): Promise<Lesson[]> {
    return this.lessonRepository.find({
      where: [{ user: { id: userId } }, { shared: true }],
      relations: ['user', 'unit', 'unit.course'],
    });
  }

  async getSharedCourses(): Promise<Course[]> {
    return this.courseRepository.find({
      where: { shared: true },
      relations: ['user'],
    });
  }

  async getSharedUnits(): Promise<Unit[]> {
    return this.unitRepository.find({
      where: { shared: true },
      relations: ['user', 'course'],
    });
  }

  async getSharedLessons(): Promise<Lesson[]> {
    return this.lessonRepository.find({
      where: { shared: true },
      relations: ['user', 'unit', 'unit.course'],
    });
  }
}
