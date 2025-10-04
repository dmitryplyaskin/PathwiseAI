import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../entities/course.entity';
import { CreateCourseDto } from '../dto/create-course.dto';
import { UpdateCourseDto } from '../dto/update-course.dto';
import { CourseListItemDto } from '../dto/course-list.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
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

  async findOneCourse(id: string) {
    const course = await this.courseRepository.findOneBy({ id });
    if (!course) {
      throw new NotFoundException(`Course with ID "${id}" not found`);
    }
    return course;
  }

  async updateCourse(id: string, updateCourseDto: UpdateCourseDto) {
    await this.findOneCourse(id);
    await this.courseRepository.update(id, updateCourseDto);
    return this.findOneCourse(id);
  }

  async removeCourse(id: string) {
    await this.findOneCourse(id);
    return this.courseRepository.delete(id);
  }
}
