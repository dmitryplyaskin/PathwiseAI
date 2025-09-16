import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamsService } from './services/exams.service';
import { ExamsController } from './controllers/exams.controller';
import { Exam } from './entities/exam.entity';
import { ExamResult } from './entities/exam-result.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Exam, ExamResult])],
  controllers: [ExamsController],
  providers: [ExamsService],
})
export class ExamsModule {}
