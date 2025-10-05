import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Question } from './question.entity';

@Entity({ name: 'user_answers' })
export class UserAnswer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @ManyToOne(() => Question, (question) => question.user_answers)
  question: Question;

  @Column('text')
  answer_text: string;

  @Column({ type: 'boolean' })
  is_correct: boolean;

  @CreateDateColumn()
  answered_at: Date;
}
