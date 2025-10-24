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
import { QuestionsService } from '../services/questions.service';
import { CreateQuestionDto } from '../dto/create-question.dto';
import { UpdateQuestionDto } from '../dto/update-question.dto';
import { CreateUserAnswerDto } from '../dto/create-user-answer.dto';
import { UpdateUserAnswerDto } from '../dto/update-user-answer.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('questions')
@UseGuards(JwtAuthGuard)
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  createQuestion(@Body() createQuestionDto: CreateQuestionDto) {
    return this.questionsService.createQuestion(createQuestionDto);
  }

  @Get()
  findAllQuestions() {
    return this.questionsService.findAllQuestions();
  }

  @Get(':id')
  findOneQuestion(@Param('id', ParseUUIDPipe) id: string) {
    return this.questionsService.findOneQuestion(id);
  }

  @Patch(':id')
  updateQuestion(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    return this.questionsService.updateQuestion(id, updateQuestionDto);
  }

  @Delete(':id')
  removeQuestion(@Param('id', ParseUUIDPipe) id: string) {
    return this.questionsService.removeQuestion(id);
  }

  @Post('answers')
  createUserAnswer(@Body() createUserAnswerDto: CreateUserAnswerDto) {
    return this.questionsService.createUserAnswer(createUserAnswerDto);
  }

  @Get('answers')
  findAllUserAnswers() {
    return this.questionsService.findAllUserAnswers();
  }

  @Get('answers/:id')
  findOneUserAnswer(@Param('id', ParseUUIDPipe) id: string) {
    return this.questionsService.findOneUserAnswer(id);
  }

  @Patch('answers/:id')
  updateUserAnswer(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserAnswerDto: UpdateUserAnswerDto,
  ) {
    return this.questionsService.updateUserAnswer(id, updateUserAnswerDto);
  }

  @Delete('answers/:id')
  removeUserAnswer(@Param('id', ParseUUIDPipe) id: string) {
    return this.questionsService.removeUserAnswer(id);
  }
}
