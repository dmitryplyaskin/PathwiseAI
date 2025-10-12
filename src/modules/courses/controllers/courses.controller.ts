import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
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
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '../../users/entities/user.entity';

@Controller('courses')
export class CoursesController {
  constructor(
    private readonly coursesService: CoursesService,
    private readonly unitsService: UnitsService,
    private readonly lessonsService: LessonsService,
  ) {}

  // Course endpoints
  @Post()
  @UseGuards(JwtAuthGuard)
  createCourse(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.createCourse(createCourseDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAllCourses(@CurrentUser() user: User) {
    return this.coursesService.findAccessibleCourses(user.id);
  }

  @Get('list')
  @UseGuards(JwtAuthGuard)
  findCoursesForList(@CurrentUser() user: User): Promise<CourseListItemDto[]> {
    return this.coursesService.findCoursesForList();
  }

  @Get('shared')
  @UseGuards(JwtAuthGuard)
  findSharedCourses(@CurrentUser() user: User) {
    return this.coursesService.findSharedCourses();
  }

  @Get('lessons')
  @UseGuards(JwtAuthGuard)
  findAllLessons(@CurrentUser() user: User) {
    return this.lessonsService.findAccessibleLessons(user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOneCourse(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return this.coursesService.findOneCourse(id, user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  updateCourse(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCourseDto: UpdateCourseDto,
    @CurrentUser() user: User,
  ) {
    return this.coursesService.updateCourse(id, updateCourseDto, user.id);
  }

  @Patch(':id/shared')
  @UseGuards(JwtAuthGuard)
  toggleCourseShared(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { shared: boolean },
    @CurrentUser() user: User,
  ) {
    return this.coursesService.updateCourse(
      id,
      { shared: body.shared },
      user.id,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  removeCourse(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return this.coursesService.removeCourse(id, user.id);
  }

  // Unit endpoints
  @Post('units')
  @UseGuards(JwtAuthGuard)
  createUnit(@Body() createUnitDto: CreateUnitDto, @CurrentUser() user: User) {
    return this.unitsService.createUnit(createUnitDto, user.id);
  }

  @Get('units')
  @UseGuards(JwtAuthGuard)
  findAllUnits(@CurrentUser() user: User) {
    return this.unitsService.findAccessibleUnits(user.id);
  }

  @Get('units/shared')
  @UseGuards(JwtAuthGuard)
  findSharedUnits(@CurrentUser() user: User) {
    return this.unitsService.findSharedUnits();
  }

  @Get('units/:id')
  @UseGuards(JwtAuthGuard)
  findOneUnit(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return this.unitsService.findOneUnit(id, user.id);
  }

  @Patch('units/:id')
  @UseGuards(JwtAuthGuard)
  updateUnit(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUnitDto: UpdateUnitDto,
    @CurrentUser() user: User,
  ) {
    return this.unitsService.updateUnit(id, updateUnitDto, user.id);
  }

  @Patch('units/:id/shared')
  @UseGuards(JwtAuthGuard)
  toggleUnitShared(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { shared: boolean },
    @CurrentUser() user: User,
  ) {
    return this.unitsService.updateUnit(id, { shared: body.shared }, user.id);
  }

  @Delete('units/:id')
  @UseGuards(JwtAuthGuard)
  removeUnit(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return this.unitsService.removeUnit(id, user.id);
  }

  // Lesson endpoints
  @Get('lessons/:id')
  @UseGuards(JwtAuthGuard)
  findOneLesson(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return this.lessonsService.findOneLesson(id, user.id);
  }

  @Post('lessons')
  @UseGuards(JwtAuthGuard)
  createLesson(
    @Body() createLessonDto: CreateLessonDto,
    @CurrentUser() user: User,
  ) {
    return this.lessonsService.createLesson(createLessonDto, user.id);
  }

  @Patch('lessons/:id')
  @UseGuards(JwtAuthGuard)
  updateLesson(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateLessonDto: UpdateLessonDto,
    @CurrentUser() user: User,
  ) {
    return this.lessonsService.updateLesson(id, updateLessonDto, user.id);
  }

  @Patch('lessons/:id/shared')
  @UseGuards(JwtAuthGuard)
  toggleLessonShared(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { shared: boolean },
    @CurrentUser() user: User,
  ) {
    return this.lessonsService.updateLesson(
      id,
      { shared: body.shared },
      user.id,
    );
  }

  @Delete('lessons/:id')
  @UseGuards(JwtAuthGuard)
  removeLesson(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return this.lessonsService.removeLesson(id, user.id);
  }

  // Module endpoint (создание урока с возможностью создания нового курса)
  @Post('modules')
  @UseGuards(JwtAuthGuard)
  createModule(@Body() createModuleDto: CreateModuleDto) {
    return this.lessonsService.createModule(createModuleDto);
  }

  // AI Assistant endpoint (вопросы к ИИ-помощнику по уроку)
  @Post('lessons/:id/ask')
  @UseGuards(JwtAuthGuard)
  async askLessonQuestion(
    @Param('id', ParseUUIDPipe) lessonId: string,
    @Body() askLessonQuestionDto: AskLessonQuestionDto,
    @CurrentUser() user: User,
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
      userId: user.id,
    });
  }

  // Получить список веток разговоров
  @Get('lessons/:id/threads')
  @UseGuards(JwtAuthGuard)
  getThreads(
    @Param('id', ParseUUIDPipe) lessonId: string,
    @CurrentUser() user: User,
  ) {
    return this.lessonsService.getThreads(lessonId, user.id);
  }

  // Получить сообщения конкретной ветки
  @Get('lessons/:id/threads/:threadId')
  @UseGuards(JwtAuthGuard)
  getThreadMessages(
    @Param('id', ParseUUIDPipe) lessonId: string,
    @Param('threadId') threadId: string,
    @CurrentUser() user: User,
  ) {
    return this.lessonsService.getThreadMessages(lessonId, threadId, user.id);
  }

  // Удалить ветку разговора
  @Delete('lessons/:id/threads/:threadId')
  @UseGuards(JwtAuthGuard)
  deleteThread(
    @Param('id', ParseUUIDPipe) lessonId: string,
    @Param('threadId') threadId: string,
    @CurrentUser() user: User,
  ) {
    return this.lessonsService.deleteThread(lessonId, threadId, user.id);
  }

  // Перегенерировать ответ
  @Post('lessons/:id/regenerate/:messageId')
  @UseGuards(JwtAuthGuard)
  regenerateMessage(
    @Param('id', ParseUUIDPipe) lessonId: string,
    @Param('messageId', ParseUUIDPipe) messageId: string,
    @CurrentUser() user: User,
  ) {
    return this.lessonsService.regenerateMessage(lessonId, messageId, user.id);
  }
}
