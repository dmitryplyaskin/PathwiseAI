import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../entities/course.entity';
import { CreateCourseDto } from '../dto/create-course.dto';
import { UpdateCourseDto } from '../dto/update-course.dto';
import { CourseListItemDto } from '../dto/course-list.dto';
import { AccessControlService } from '../../../shared/services/access-control.service';
import { AccessDeniedException } from '../../../shared/exceptions/access-denied.exception';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    private readonly accessControlService: AccessControlService,
  ) {}

  createCourse(createCourseDto: CreateCourseDto) {
    const course = this.courseRepository.create({
      ...createCourseDto,
      user: { id: createCourseDto.userId },
    });
    return this.courseRepository.save(course);
  }

  findAllCourses() {
    return this.courseRepository.find();
  }

  async findCoursesForList(): Promise<CourseListItemDto[]> {
    const courses = await this.courseRepository.find({
      select: ['id', 'title'],
    });
    return courses.map((course) => ({
      id: course.id,
      title: course.title,
    }));
  }

  async findOneCourse(id: string, userId: string) {
    const course = await this.courseRepository.findOneBy({ id });
    if (!course) {
      throw new NotFoundException(`Course with ID "${id}" not found`);
    }

    const hasAccess = await this.accessControlService.checkCourseAccess(
      id,
      userId,
    );
    if (!hasAccess) {
      throw new AccessDeniedException('курсу', id);
    }

    return course;
  }

  async findCourseWithLessons(id: string, userId: string) {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['units', 'units.lessons'],
      order: {
        units: { order: 'ASC', lessons: { order: 'ASC' } },
      },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID "${id}" not found`);
    }

    const hasAccess = await this.accessControlService.checkCourseAccess(
      id,
      userId,
    );
    if (!hasAccess) {
      throw new AccessDeniedException('курсу', id);
    }

    return course;
  }

  async updateCourse(
    id: string,
    updateCourseDto: UpdateCourseDto,
    userId: string,
  ) {
    await this.findOneCourse(id, userId);
    await this.courseRepository.update(id, updateCourseDto);
    return this.findOneCourse(id, userId);
  }

  async removeCourse(id: string, userId: string) {
    await this.findOneCourse(id, userId);
    return this.courseRepository.delete(id);
  }

  async findAccessibleCourses(userId: string): Promise<Course[]> {
    return this.accessControlService.getAccessibleCourses(userId);
  }

  async findSharedCourses(): Promise<Course[]> {
    return this.accessControlService.getSharedCourses();
  }
}
