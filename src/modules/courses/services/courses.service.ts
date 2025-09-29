import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../entities/course.entity';
import { Unit } from '../entities/unit.entity';
import { Lesson } from '../entities/lesson.entity';
import { CreateCourseDto } from '../dto/create-course.dto';
import { UpdateCourseDto } from '../dto/update-course.dto';
import { CreateUnitDto } from '../dto/create-unit.dto';
import { UpdateUnitDto } from '../dto/update-unit.dto';
import { CreateLessonDto } from '../dto/create-lesson.dto';
import { UpdateLessonDto } from '../dto/update-lesson.dto';
import { CourseListItemDto } from '../dto/course-list.dto';
import { CreateModuleDto } from '../dto/create-module.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(Unit)
    private readonly unitRepository: Repository<Unit>,
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
  ) {}

  // ... Course methods
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
    await this.findOneCourse(id); // Проверка существования
    await this.courseRepository.update(id, updateCourseDto);
    return this.findOneCourse(id);
  }

  async removeCourse(id: string) {
    await this.findOneCourse(id); // Проверка существования
    return this.courseRepository.delete(id);
  }

  // ... Unit methods
  createUnit(createUnitDto: CreateUnitDto) {
    const unit = this.unitRepository.create({
      ...createUnitDto,
      course: { id: createUnitDto.courseId },
    });
    return this.unitRepository.save(unit);
  }

  findAllUnits() {
    return this.unitRepository.find();
  }

  async findOneUnit(id: string) {
    const unit = await this.unitRepository.findOneBy({ id });
    if (!unit) {
      throw new NotFoundException(`Unit with ID "${id}" not found`);
    }
    return unit;
  }

  async updateUnit(id: string, updateUnitDto: UpdateUnitDto) {
    await this.findOneUnit(id); // Проверка существования
    await this.unitRepository.update(id, updateUnitDto);
    return this.findOneUnit(id);
  }

  async removeUnit(id: string) {
    await this.findOneUnit(id); // Проверка существования
    return this.unitRepository.delete(id);
  }

  // ... Lesson methods
  createLesson(createLessonDto: CreateLessonDto) {
    const lesson = this.lessonRepository.create({
      ...createLessonDto,
      unit: { id: createLessonDto.unitId },
    });
    return this.lessonRepository.save(lesson);
  }

  findAllLessons() {
    return this.lessonRepository.find();
  }

  async findOneLesson(id: string) {
    const lesson = await this.lessonRepository.findOneBy({ id });
    if (!lesson) {
      throw new NotFoundException(`Lesson with ID "${id}" not found`);
    }
    return lesson;
  }

  async updateLesson(id: string, updateLessonDto: UpdateLessonDto) {
    await this.findOneLesson(id); // Проверка существования
    await this.lessonRepository.update(id, updateLessonDto);
    return this.findOneLesson(id);
  }

  async removeLesson(id: string) {
    await this.findOneLesson(id); // Проверка существования
    return this.lessonRepository.delete(id);
  }

  async createModule(createModuleDto: CreateModuleDto) {
    let courseId = createModuleDto.courseId;

    // Если выбран новый курс, создаем его
    if (!courseId && createModuleDto.newCourseName) {
      const newCourse = await this.createCourse({
        title: createModuleDto.newCourseName,
        description: `Курс создан автоматически для урока: ${createModuleDto.topic}`,
        userId: createModuleDto.userId,
      });
      courseId = newCourse.id;
    }

    if (!courseId) {
      throw new Error('Course ID is required');
    }

    // Создаем урок (пока что как заглушку)
    // В будущем здесь будет интеграция с AI для генерации контента
    const lesson = {
      topic: createModuleDto.topic,
      details: createModuleDto.details,
      complexity: createModuleDto.complexity,
      courseId,
      status: 'generated', // заглушка
      content: `Урок по теме "${createModuleDto.topic}" будет сгенерирован с уровнем сложности "${createModuleDto.complexity}".`,
    };

    return lesson;
  }
}
