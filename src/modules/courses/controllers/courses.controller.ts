import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CoursesService } from '../services/courses.service';
import { CreateCourseDto } from '../dto/create-course.dto';
import { UpdateCourseDto } from '../dto/update-course.dto';
import { CreateUnitDto } from '../dto/create-unit.dto';
import { UpdateUnitDto } from '../dto/update-unit.dto';
import { CreateLessonDto } from '../dto/create-lesson.dto';
import { UpdateLessonDto } from '../dto/update-lesson.dto';
import { CreateModuleDto } from '../dto/create-module.dto';
import { CourseListItemDto } from '../dto/course-list.dto';
import { AskLessonQuestionDto } from '../dto/ask-lesson-question.dto';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  // Course endpoints
  @Post()
  createCourse(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.createCourse(createCourseDto);
  }

  @Get()
  findAllCourses() {
    return this.coursesService.findAllCourses();
  }

  @Get('list')
  findCoursesForList(): Promise<CourseListItemDto[]> {
    return this.coursesService.findCoursesForList();
  }

  @Get(':id')
  findOneCourse(@Param('id', ParseUUIDPipe) id: string) {
    return this.coursesService.findOneCourse(id);
  }

  @Patch(':id')
  updateCourse(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return this.coursesService.updateCourse(id, updateCourseDto);
  }

  @Delete(':id')
  removeCourse(@Param('id', ParseUUIDPipe) id: string) {
    return this.coursesService.removeCourse(id);
  }

  // Unit endpoints
  @Post('units')
  createUnit(@Body() createUnitDto: CreateUnitDto) {
    return this.coursesService.createUnit(createUnitDto);
  }

  @Get('units')
  findAllUnits() {
    return this.coursesService.findAllUnits();
  }

  @Get('units/:id')
  findOneUnit(@Param('id', ParseUUIDPipe) id: string) {
    return this.coursesService.findOneUnit(id);
  }

  @Patch('units/:id')
  updateUnit(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUnitDto: UpdateUnitDto,
  ) {
    return this.coursesService.updateUnit(id, updateUnitDto);
  }

  @Delete('units/:id')
  removeUnit(@Param('id', ParseUUIDPipe) id: string) {
    return this.coursesService.removeUnit(id);
  }

  // Lesson endpoints
  @Post('lessons')
  createLesson(@Body() createLessonDto: CreateLessonDto) {
    return this.coursesService.createLesson(createLessonDto);
  }

  @Get('lessons')
  findAllLessons() {
    return this.coursesService.findAllLessons();
  }

  @Get('lessons/:id')
  findOneLesson(@Param('id', ParseUUIDPipe) id: string) {
    return this.coursesService.findOneLesson(id);
  }

  @Patch('lessons/:id')
  updateLesson(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateLessonDto: UpdateLessonDto,
  ) {
    return this.coursesService.updateLesson(id, updateLessonDto);
  }

  @Delete('lessons/:id')
  removeLesson(@Param('id', ParseUUIDPipe) id: string) {
    return this.coursesService.removeLesson(id);
  }

  // Module endpoint (создание урока с возможностью создания нового курса)
  @Post('modules')
  createModule(@Body() createModuleDto: CreateModuleDto) {
    return this.coursesService.createModule(createModuleDto);
  }

  // AI Assistant endpoint (вопросы к ИИ-помощнику по уроку)
  @Post('lessons/:id/ask')
  async askLessonQuestion(
    @Param('id', ParseUUIDPipe) lessonId: string,
    @Body() askLessonQuestionDto: AskLessonQuestionDto,
  ): Promise<{
    question: string;
    answer: string;
    lessonTitle: string;
    messageId: string;
  }> {
    // Используем lessonId из параметра URL
    return this.coursesService.askLessonQuestion({
      ...askLessonQuestionDto,
      lessonId,
    });
  }
}
