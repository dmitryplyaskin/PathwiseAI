import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamsService } from './services/exams.service';
import { ExamsController } from './controllers/exams.controller';
import { Exam } from './entities/exam.entity';
import { ExamResult } from './entities/exam-result.entity';
import { Lesson } from '../courses/entities/lesson.entity';
import { Question } from '../questions/entities/question.entity';
import { ChatModule } from '../chat/chat.module';
import { SM2SpacedRepetitionService } from '../courses/services/sm2-spaced-repetition.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Exam, ExamResult, Lesson, Question]),
    ChatModule,
  ],
  controllers: [ExamsController],
  providers: [ExamsService, SM2SpacedRepetitionService],
  exports: [ExamsService],
})
export class ExamsModule {}
