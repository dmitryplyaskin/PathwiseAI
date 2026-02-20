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
import { ExamsService } from '../services/exams.service';
import { CreateExamDto } from '../dto/create-exam.dto';
import { UpdateExamDto } from '../dto/update-exam.dto';
import { CreateExamResultDto } from '../dto/create-exam-result.dto';
import { UpdateExamResultDto } from '../dto/update-exam-result.dto';
import { GenerateTestDto } from '../dto/generate-test.dto';
import { SubmitTestResultDto } from '../dto/submit-test-result.dto';
import { CheckTextAnswerDto } from '../dto/check-text-answer.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import type { User } from '../../users/entities/user.entity';

@Controller('exams')
@UseGuards(JwtAuthGuard)
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Post()
  createExam(@Body() createExamDto: CreateExamDto, @CurrentUser() user: User) {
    return this.examsService.createExam(createExamDto, user.id);
  }

  @Get('me')
  findMyExams(@CurrentUser() user: User) {
    return this.examsService.findExamsByUser(user.id);
  }

  @Get('lesson/:lessonId')
  findExamsByLesson(
    @Param('lessonId', ParseUUIDPipe) lessonId: string,
    @CurrentUser() user: User,
  ) {
    return this.examsService.findExamsByLesson(lessonId, user.id);
  }

  @Delete('lesson/:lessonId/progress')
  deleteLessonProgress(
    @Param('lessonId', ParseUUIDPipe) lessonId: string,
    @CurrentUser() user: User,
  ) {
    return this.examsService.deleteExamsByLesson(lessonId, user.id);
  }

  @Post('results')
  createExamResult(
    @Body() createExamResultDto: CreateExamResultDto,
    @CurrentUser() user: User,
  ) {
    return this.examsService.createExamResult(createExamResultDto, user.id);
  }

  @Get('results')
  findAllExamResults(@CurrentUser() user: User) {
    return this.examsService.findAllExamResults(user.id);
  }

  @Get('results/:id')
  findOneExamResult(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return this.examsService.findOneExamResult(id, user.id);
  }

  @Patch('results/:id')
  updateExamResult(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateExamResultDto: UpdateExamResultDto,
    @CurrentUser() user: User,
  ) {
    return this.examsService.updateExamResult(id, updateExamResultDto, user.id);
  }

  @Delete('results/:id')
  removeExamResult(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.examsService.removeExamResult(id, user.id);
  }

  @Post('generate-for-lesson')
  generateTestForLesson(
    @Body() generateTestDto: GenerateTestDto,
    @CurrentUser() user: User,
  ) {
    return this.examsService.getOrGenerateTestForLesson(generateTestDto, user.id);
  }

  @Post('submit-result')
  submitTestResult(
    @Body() submitTestResultDto: SubmitTestResultDto,
    @CurrentUser() user: User,
  ) {
    return this.examsService.submitTestResult(submitTestResultDto, user.id);
  }

  @Post('check-text-answer')
  checkTextAnswer(@Body() checkTextAnswerDto: CheckTextAnswerDto) {
    return this.examsService.checkTextAnswer(checkTextAnswerDto);
  }

  @Get()
  findAllExams(@CurrentUser() user: User) {
    return this.examsService.findAllExams(user.id);
  }

  @Get(':id')
  findOneExam(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.examsService.findOneExam(id, user.id);
  }

  @Patch(':id')
  updateExam(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateExamDto: UpdateExamDto,
    @CurrentUser() user: User,
  ) {
    return this.examsService.updateExam(id, updateExamDto, user.id);
  }

  @Delete(':id')
  removeExam(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.examsService.removeExam(id, user.id);
  }
}