import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionsService } from './services/questions.service';
import { QuestionsController } from './controllers/questions.controller';
import { Question } from './entities/question.entity';
import { UserAnswer } from './entities/user-answer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Question, UserAnswer])],
  controllers: [QuestionsController],
  providers: [QuestionsService],
  exports: [QuestionsService],
})
export class QuestionsModule {}
