import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Lesson } from '../../courses/entities/lesson.entity';
import { UserAnswer } from './user-answer.entity';
import { ExamResult } from '../../exams/entities/exam-result.entity';

export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  OPEN_ENDED = 'open_ended',
  TRUE_FALSE = 'true_false',
}

@Entity({ name: 'questions' })
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Lesson, (lesson) => lesson.questions)
  lesson: Lesson;

  @Column('text')
  question_text: string;

  @Column({
    type: 'enum',
    enum: QuestionType,
  })
  question_type: QuestionType;

  @Column('jsonb', { nullable: true })
  options: Record<string, any>;

  @Column('text')
  correct_answer: string;

  @Column('text', { nullable: true })
  explanation: string;

  @OneToMany(() => UserAnswer, (userAnswer) => userAnswer.question)
  user_answers: UserAnswer[];

  @OneToMany(() => ExamResult, (examResult) => examResult.question)
  exam_results: ExamResult[];
}
