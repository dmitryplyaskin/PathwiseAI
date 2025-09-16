import { Injectable } from '@nestjs/common';
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

  findOneExam(id: string) {
    return this.examRepository.findOneBy({ id });
  }

  updateExam(id: string, updateExamDto: UpdateExamDto) {
    return this.examRepository.update(id, updateExamDto);
  }

  removeExam(id: string) {
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

  findOneExamResult(id: string) {
    return this.examResultRepository.findOneBy({ id });
  }

  updateExamResult(id: string, updateExamResultDto: UpdateExamResultDto) {
    return this.examResultRepository.update(id, updateExamResultDto);
  }

  removeExamResult(id: string) {
    return this.examResultRepository.delete(id);
  }
}
