import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Unit } from './unit.entity';
import { Question } from '../../questions/entities/question.entity';
import { ClarificationMessage } from '../../chat/entities/clarification-message.entity';

export enum LessonStatus {
  NOT_STARTED = 'not_started',
  LEARNING = 'learning',
  MASTERED = 'mastered',
}

@Entity({ name: 'lessons' })
export class Lesson {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Unit, (unit) => unit.lessons)
  unit: Unit;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column('int')
  order: number;

  @Column({
    type: 'enum',
    enum: LessonStatus,
    default: LessonStatus.NOT_STARTED,
  })
  status: LessonStatus;

  @Column({ nullable: true })
  last_reviewed_at: Date;

  @Column({ nullable: true })
  next_review_at: Date;

  @Column('float', { default: 2.5 })
  ease_factor: number;

  @Column('int', { default: 0 })
  interval: number;

  @OneToMany(() => Question, (question) => question.lesson)
  questions: Question[];

  @OneToMany(() => ClarificationMessage, (message) => message.lesson)
  messages: ClarificationMessage[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
