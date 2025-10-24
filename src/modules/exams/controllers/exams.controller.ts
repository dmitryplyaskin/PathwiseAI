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

@Controller('exams')
@UseGuards(JwtAuthGuard)
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Post()
  createExam(@Body() createExamDto: CreateExamDto) {
    return this.examsService.createExam(createExamDto);
  }

  @Get()
  findAllExams() {
    return this.examsService.findAllExams();
  }

  @Get('lesson/:lessonId/user/:userId')
  findExamsByLesson(
    @Param('lessonId', ParseUUIDPipe) lessonId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.examsService.findExamsByLesson(lessonId, userId);
  }

  @Get('user/:userId')
  findExamsByUser(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.examsService.findExamsByUser(userId);
  }

  @Get(':id')
  findOneExam(@Param('id', ParseUUIDPipe) id: string) {
    return this.examsService.findOneExam(id);
  }

  @Patch(':id')
  updateExam(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateExamDto: UpdateExamDto,
  ) {
    return this.examsService.updateExam(id, updateExamDto);
  }

  @Delete(':id')
  removeExam(@Param('id', ParseUUIDPipe) id: string) {
    return this.examsService.removeExam(id);
  }

  @Post('results')
  createExamResult(@Body() createExamResultDto: CreateExamResultDto) {
    return this.examsService.createExamResult(createExamResultDto);
  }

  @Get('results')
  findAllExamResults() {
    return this.examsService.findAllExamResults();
  }

  @Get('results/:id')
  findOneExamResult(@Param('id', ParseUUIDPipe) id: string) {
    return this.examsService.findOneExamResult(id);
  }

  @Patch('results/:id')
  updateExamResult(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateExamResultDto: UpdateExamResultDto,
  ) {
    return this.examsService.updateExamResult(id, updateExamResultDto);
  }

  @Delete('results/:id')
  removeExamResult(@Param('id', ParseUUIDPipe) id: string) {
    return this.examsService.removeExamResult(id);
  }

  // New endpoints for test generation and submission
  @Post('generate-for-lesson')
  generateTestForLesson(@Body() generateTestDto: GenerateTestDto) {
    return this.examsService.getOrGenerateTestForLesson(generateTestDto);
  }

  @Post('submit-result')
  submitTestResult(@Body() submitTestResultDto: SubmitTestResultDto) {
    return this.examsService.submitTestResult(submitTestResultDto);
  }

  @Post('check-text-answer')
  checkTextAnswer(@Body() checkTextAnswerDto: CheckTextAnswerDto) {
    return this.examsService.checkTextAnswer(checkTextAnswerDto);
  }
}
