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
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import type { User } from '../../users/entities/user.entity';

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

  @Post('answers')
  createUserAnswer(
    @Body() createUserAnswerDto: CreateUserAnswerDto,
    @CurrentUser() user: User,
  ) {
    return this.questionsService.createUserAnswer(createUserAnswerDto, user.id);
  }

  @Get('answers')
  findAllUserAnswers(@CurrentUser() user: User) {
    return this.questionsService.findAllUserAnswers(user.id);
  }

  @Get('answers/:id')
  findOneUserAnswer(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return this.questionsService.findOneUserAnswer(id, user.id);
  }

  @Patch('answers/:id')
  updateUserAnswer(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserAnswerDto: UpdateUserAnswerDto,
    @CurrentUser() user: User,
  ) {
    return this.questionsService.updateUserAnswer(id, updateUserAnswerDto, user.id);
  }

  @Delete('answers/:id')
  removeUserAnswer(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return this.questionsService.removeUserAnswer(id, user.id);
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
}