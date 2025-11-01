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
import { LessonsService } from '../services/lessons.service';
import { CreateCourseDto } from '../dto/create-course.dto';
import { UpdateCourseDto } from '../dto/update-course.dto';
import { CreateCourseOutlineDto } from '../dto/create-course-outline.dto';
import { CourseListItemDto } from '../dto/course-list.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '../../users/entities/user.entity';

@Controller('courses')
export class CoursesController {
  constructor(
    private readonly coursesService: CoursesService,
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
  findCoursesForList(): Promise<CourseListItemDto[]> {
    return this.coursesService.findCoursesForList();
  }

  @Get('shared')
  @UseGuards(JwtAuthGuard)
  findSharedCourses() {
    return this.coursesService.findSharedCourses();
  }

  @Get(':id/lessons')
  @UseGuards(JwtAuthGuard)
  getCourseLessons(
    @Param('id', ParseUUIDPipe) courseId: string,
    @CurrentUser() user: User,
  ) {
    return this.lessonsService.findLessonsByCourseId(courseId, user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOneCourse(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return this.coursesService.findCourseWithLessons(id, user.id);
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

  // Course outline endpoint (создание курса с уроками-заглушками)
  @Post('outlines')
  @UseGuards(JwtAuthGuard)
  createCourseOutline(
    @Body() createCourseOutlineDto: CreateCourseOutlineDto,
    @CurrentUser() user: User,
  ) {
    return this.lessonsService.createCourseOutline({
      ...createCourseOutlineDto,
      userId: user.id,
    });
  }
}
