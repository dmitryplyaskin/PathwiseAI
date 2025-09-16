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
import { ExamsService } from '../services/exams.service';
import { CreateExamDto } from '../dto/create-exam.dto';
import { UpdateExamDto } from '../dto/update-exam.dto';
import { CreateExamResultDto } from '../dto/create-exam-result.dto';
import { UpdateExamResultDto } from '../dto/update-exam-result.dto';

@Controller('exams')
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
}
