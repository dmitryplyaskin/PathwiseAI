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
    await this.findOneQuestion(id);
    await this.questionRepository.update(id, updateQuestionDto);
    return this.findOneQuestion(id);
  }

  async removeQuestion(id: string) {
    await this.findOneQuestion(id);
    return this.questionRepository.delete(id);
  }

  createUserAnswer(createUserAnswerDto: CreateUserAnswerDto, userId: string) {
    const userAnswer = this.userAnswerRepository.create({
      ...createUserAnswerDto,
      user: { id: userId },
      question: { id: createUserAnswerDto.questionId },
    });
    return this.userAnswerRepository.save(userAnswer);
  }

  findAllUserAnswers(userId: string) {
    return this.userAnswerRepository.find({
      where: { user: { id: userId } },
      relations: ['question'],
    });
  }

  async findOneUserAnswer(id: string, userId: string) {
    const userAnswer = await this.userAnswerRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['question'],
    });
    if (!userAnswer) {
      throw new NotFoundException(`UserAnswer with ID "${id}" not found`);
    }
    return userAnswer;
  }

  async updateUserAnswer(
    id: string,
    updateUserAnswerDto: UpdateUserAnswerDto,
    userId: string,
  ) {
    await this.findOneUserAnswer(id, userId);
    await this.userAnswerRepository.update(id, updateUserAnswerDto);
    return this.findOneUserAnswer(id, userId);
  }

  async removeUserAnswer(id: string, userId: string) {
    await this.findOneUserAnswer(id, userId);
    return this.userAnswerRepository.delete(id);
  }
}