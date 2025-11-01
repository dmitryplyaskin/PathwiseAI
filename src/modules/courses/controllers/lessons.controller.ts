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
import { LessonsService } from '../services/lessons.service';
import { CreateLessonDto } from '../dto/create-lesson.dto';
import { UpdateLessonDto } from '../dto/update-lesson.dto';
import { CreateModuleDto } from '../dto/create-module.dto';
import { AskLessonQuestionDto } from '../dto/ask-lesson-question.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '../../users/entities/user.entity';

@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findAllLessons(@CurrentUser() user: User) {
    return this.lessonsService.findAccessibleLessons(user.id);
  }

  @Get('for-review/:userId')
  @UseGuards(JwtAuthGuard)
  getLessonsForReview(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.lessonsService.findLessonsForReview(userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOneLesson(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return this.lessonsService.findOneLesson(id, user.id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createLesson(
    @Body() createLessonDto: CreateLessonDto,
    @CurrentUser() user: User,
  ) {
    return this.lessonsService.createLesson(createLessonDto, user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  updateLesson(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateLessonDto: UpdateLessonDto,
    @CurrentUser() user: User,
  ) {
    return this.lessonsService.updateLesson(id, updateLessonDto, user.id);
  }

  @Patch(':id/shared')
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

  @Delete(':id')
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
  @Post(':id/ask')
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
    return this.lessonsService.askLessonQuestion({
      ...askLessonQuestionDto,
      lessonId,
      userId: user.id,
    });
  }

  // Получить список веток разговоров
  @Get(':id/threads')
  @UseGuards(JwtAuthGuard)
  getThreads(
    @Param('id', ParseUUIDPipe) lessonId: string,
    @CurrentUser() user: User,
  ) {
    return this.lessonsService.getThreads(lessonId, user.id);
  }

  // Получить сообщения конкретной ветки
  @Get(':id/threads/:threadId')
  @UseGuards(JwtAuthGuard)
  getThreadMessages(
    @Param('id', ParseUUIDPipe) lessonId: string,
    @Param('threadId') threadId: string,
    @CurrentUser() user: User,
  ) {
    return this.lessonsService.getThreadMessages(lessonId, threadId, user.id);
  }

  // Удалить ветку разговора
  @Delete(':id/threads/:threadId')
  @UseGuards(JwtAuthGuard)
  deleteThread(
    @Param('id', ParseUUIDPipe) lessonId: string,
    @Param('threadId') threadId: string,
    @CurrentUser() user: User,
  ) {
    return this.lessonsService.deleteThread(lessonId, threadId, user.id);
  }

  // Перегенерировать ответ
  @Post(':id/regenerate/:messageId')
  @UseGuards(JwtAuthGuard)
  regenerateMessage(
    @Param('id', ParseUUIDPipe) lessonId: string,
    @Param('messageId', ParseUUIDPipe) messageId: string,
    @CurrentUser() user: User,
  ) {
    return this.lessonsService.regenerateMessage(lessonId, messageId, user.id);
  }
}
