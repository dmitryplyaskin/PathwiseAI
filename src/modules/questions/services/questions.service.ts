import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findOneQuestion(id: string) {
    const question = await this.questionRepository.findOneBy({ id });
    if (!question) {
      throw new NotFoundException(`Question with ID "${id}" not found`);
    }
    return question;
  }

  async updateQuestion(id: string, updateQuestionDto: UpdateQuestionDto) {
    await this.findOneQuestion(id); // Проверка существования
    await this.questionRepository.update(id, updateQuestionDto);
    return this.findOneQuestion(id);
  }

  async removeQuestion(id: string) {
    await this.findOneQuestion(id); // Проверка существования
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

  async findOneUserAnswer(id: string) {
    const userAnswer = await this.userAnswerRepository.findOneBy({ id });
    if (!userAnswer) {
      throw new NotFoundException(`UserAnswer with ID "${id}" not found`);
    }
    return userAnswer;
  }

  async updateUserAnswer(id: string, updateUserAnswerDto: UpdateUserAnswerDto) {
    await this.findOneUserAnswer(id); // Проверка существования
    await this.userAnswerRepository.update(id, updateUserAnswerDto);
    return this.findOneUserAnswer(id);
  }

  async removeUserAnswer(id: string) {
    await this.findOneUserAnswer(id); // Проверка существования
    return this.userAnswerRepository.delete(id);
  }
}
