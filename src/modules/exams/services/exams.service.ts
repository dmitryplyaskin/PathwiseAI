import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exam } from '../entities/exam.entity';
import { ExamResult } from '../entities/exam-result.entity';
import { CreateExamDto } from '../dto/create-exam.dto';
import { UpdateExamDto } from '../dto/update-exam.dto';
import { CreateExamResultDto } from '../dto/create-exam-result.dto';
import { UpdateExamResultDto } from '../dto/update-exam-result.dto';

@Injectable()
export class ExamsService {
  constructor(
    @InjectRepository(Exam)
    private readonly examRepository: Repository<Exam>,
    @InjectRepository(ExamResult)
    private readonly examResultRepository: Repository<ExamResult>,
  ) {}

  // Exam methods
  createExam(createExamDto: CreateExamDto) {
    const exam = this.examRepository.create({
      ...createExamDto,
      user: { id: createExamDto.userId },
      course: { id: createExamDto.courseId },
    });
    return this.examRepository.save(exam);
  }

  findAllExams() {
    return this.examRepository.find();
  }

  async findOneExam(id: string) {
    const exam = await this.examRepository.findOneBy({ id });
    if (!exam) {
      throw new NotFoundException(`Exam with ID "${id}" not found`);
    }
    return exam;
  }

  async updateExam(id: string, updateExamDto: UpdateExamDto) {
    await this.findOneExam(id); // Проверка существования
    await this.examRepository.update(id, updateExamDto);
    return this.findOneExam(id);
  }

  async removeExam(id: string) {
    await this.findOneExam(id); // Проверка существования
    return this.examRepository.delete(id);
  }

  // ExamResult methods
  createExamResult(createExamResultDto: CreateExamResultDto) {
    const examResult = this.examResultRepository.create({
      ...createExamResultDto,
      exam: { id: createExamResultDto.examId },
      question: { id: createExamResultDto.questionId },
    });
    return this.examResultRepository.save(examResult);
  }

  findAllExamResults() {
    return this.examResultRepository.find();
  }

  async findOneExamResult(id: string) {
    const examResult = await this.examResultRepository.findOneBy({ id });
    if (!examResult) {
      throw new NotFoundException(`ExamResult with ID "${id}" not found`);
    }
    return examResult;
  }

  async updateExamResult(id: string, updateExamResultDto: UpdateExamResultDto) {
    await this.findOneExamResult(id); // Проверка существования
    await this.examResultRepository.update(id, updateExamResultDto);
    return this.findOneExamResult(id);
  }

  async removeExamResult(id: string) {
    await this.findOneExamResult(id); // Проверка существования
    return this.examResultRepository.delete(id);
  }
}
