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
      relations: ['units', 'units.lessons'],
    });

    return courses.map((course) => {
      const totalLessons =
        course.units?.reduce(
          (sum, unit) => sum + (unit.lessons?.length || 0),
          0,
        ) || 0;
      const completedLessons =
        course.units?.reduce(
          (sum, unit) =>
            sum +
            (unit.lessons?.filter((lesson) => lesson.status === 'mastered')
              .length || 0),
          0,
        ) || 0;

      return {
        id: course.id,
        title: course.title,
        description: course.description,
        shortDescription: course.description.substring(0, 100) + '...',
        progress: Math.round(
          (completedLessons / Math.max(totalLessons, 1)) * 100,
        ),
        unitsCount: course.units?.length || 0,
        completedUnits:
          course.units?.filter((unit) =>
            unit.lessons?.every((lesson) => lesson.status === 'mastered'),
          ).length || 0,
        totalLessons,
        completedLessons,
        lastStudied: course.updated_at.toISOString(),
        status: course.status,
        difficulty: 'beginner' as const,
        estimatedTime: '30-40 часов',
        category: 'machine_learning' as const,
        tags: ['ИИ-курс'],
        rating: 4.5,
        studentsCount: 1000,
        instructor: 'ИИ-Помощник',
        thumbnail: '',
      };
    });
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
