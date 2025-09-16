import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from '../entities/question.entity';
import { UserAnswer } from '../entities/user-answer.entity';
import { CreateQuestionDto } from '../dto/create-question.dto';
import { UpdateQuestionDto } from '../dto/update-question.dto';
import { CreateUserAnswerDto } from '../dto/create-user-answer.dto';
import { UpdateUserAnswerDto } from '../dto/update-user-answer.dto';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(UserAnswer)
    private readonly userAnswerRepository: Repository<UserAnswer>,
  ) {}

  // Question methods
  createQuestion(createQuestionDto: CreateQuestionDto) {
    const question = this.questionRepository.create({
      ...createQuestionDto,
      lesson: { id: createQuestionDto.lessonId },
    });
    return this.questionRepository.save(question);
  }

  findAllQuestions() {
    return this.questionRepository.find();
  }

  findOneQuestion(id: string) {
    return this.questionRepository.findOneBy({ id });
  }

  updateQuestion(id: string, updateQuestionDto: UpdateQuestionDto) {
    return this.questionRepository.update(id, updateQuestionDto);
  }

  removeQuestion(id: string) {
    return this.questionRepository.delete(id);
  }

  // UserAnswer methods
  createUserAnswer(createUserAnswerDto: CreateUserAnswerDto) {
    const userAnswer = this.userAnswerRepository.create({
      ...createUserAnswerDto,
      user: { id: createUserAnswerDto.userId },
      question: { id: createUserAnswerDto.questionId },
    });
    return this.userAnswerRepository.save(userAnswer);
  }

  findAllUserAnswers() {
    return this.userAnswerRepository.find();
  }

  findOneUserAnswer(id: string) {
    return this.userAnswerRepository.findOneBy({ id });
  }

  updateUserAnswer(id: string, updateUserAnswerDto: UpdateUserAnswerDto) {
    return this.userAnswerRepository.update(id, updateUserAnswerDto);
  }

  removeUserAnswer(id: string) {
    return this.userAnswerRepository.delete(id);
  }
}
