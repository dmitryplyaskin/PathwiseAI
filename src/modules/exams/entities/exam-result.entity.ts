import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Exam } from './exam.entity';
import { Question } from '../../questions/entities/question.entity';

@Entity({ name: 'exam_results' })
export class ExamResult {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Exam, (exam) => exam.results)
  exam: Exam;

  @ManyToOne(() => Question, (question) => question.id)
  question: Question;

  @Column('text')
  user_answer: string;

  @Column({ type: 'boolean' })
  is_correct: boolean;
}
