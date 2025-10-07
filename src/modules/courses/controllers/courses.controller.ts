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
import { UnitsService } from '../services/units.service';
import { LessonsService } from '../services/lessons.service';
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
  constructor(
    private readonly coursesService: CoursesService,
    private readonly unitsService: UnitsService,
    private readonly lessonsService: LessonsService,
  ) {}

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

  @Get('lessons')
  findAllLessons() {
    return this.lessonsService.findAllLessons();
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
    return this.unitsService.createUnit(createUnitDto);
  }

  @Get('units')
  findAllUnits() {
    return this.unitsService.findAllUnits();
  }

  @Get('units/:id')
  findOneUnit(@Param('id', ParseUUIDPipe) id: string) {
    return this.unitsService.findOneUnit(id);
  }

  @Patch('units/:id')
  updateUnit(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUnitDto: UpdateUnitDto,
  ) {
    return this.unitsService.updateUnit(id, updateUnitDto);
  }

  @Delete('units/:id')
  removeUnit(@Param('id', ParseUUIDPipe) id: string) {
    return this.unitsService.removeUnit(id);
  }

  // Lesson endpoints
  @Get('lessons/:id')
  findOneLesson(@Param('id', ParseUUIDPipe) id: string) {
    return this.lessonsService.findOneLesson(id);
  }

  @Post('lessons')
  createLesson(@Body() createLessonDto: CreateLessonDto) {
    return this.lessonsService.createLesson(createLessonDto);
  }

  @Patch('lessons/:id')
  updateLesson(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateLessonDto: UpdateLessonDto,
  ) {
    return this.lessonsService.updateLesson(id, updateLessonDto);
  }

  @Delete('lessons/:id')
  removeLesson(@Param('id', ParseUUIDPipe) id: string) {
    return this.lessonsService.removeLesson(id);
  }

  // Module endpoint (создание урока с возможностью создания нового курса)
  @Post('modules')
  createModule(@Body() createModuleDto: CreateModuleDto) {
    return this.lessonsService.createModule(createModuleDto);
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
    threadId: string;
  }> {
    // Используем lessonId из параметра URL
    return this.lessonsService.askLessonQuestion({
      ...askLessonQuestionDto,
      lessonId,
    });
  }

  // Получить список веток разговоров
  @Get('lessons/:id/threads')
  getThreads(@Param('id', ParseUUIDPipe) lessonId: string) {
    return this.lessonsService.getThreads(lessonId);
  }

  // Получить сообщения конкретной ветки
  @Get('lessons/:id/threads/:threadId')
  getThreadMessages(
    @Param('id', ParseUUIDPipe) lessonId: string,
    @Param('threadId') threadId: string,
  ) {
    return this.lessonsService.getThreadMessages(lessonId, threadId);
  }

  // Удалить ветку разговора
  @Delete('lessons/:id/threads/:threadId')
  deleteThread(
    @Param('id', ParseUUIDPipe) lessonId: string,
    @Param('threadId') threadId: string,
  ) {
    return this.lessonsService.deleteThread(lessonId, threadId);
  }

  // Перегенерировать ответ
  @Post('lessons/:id/regenerate/:messageId')
  regenerateMessage(
    @Param('id', ParseUUIDPipe) lessonId: string,
    @Param('messageId', ParseUUIDPipe) messageId: string,
  ) {
    return this.lessonsService.regenerateMessage(lessonId, messageId);
  }
}
