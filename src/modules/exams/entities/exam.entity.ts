import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Course } from '../../courses/entities/course.entity';
import { ExamResult } from './exam-result.entity';

export enum ExamStatus {
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity({ name: 'exams' })
export class Exam {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @ManyToOne(() => Course, (course) => course.id)
  course: Course;

  @Column()
  title: string;

  @Column({
    type: 'enum',
    enum: ExamStatus,
    default: ExamStatus.IN_PROGRESS,
  })
  status: ExamStatus;

  @Column('float', { nullable: true })
  score: number;

  @Column()
  started_at: Date;

  @Column({ nullable: true })
  completed_at: Date;

  @OneToMany(() => ExamResult, (examResult) => examResult.exam)
  results: ExamResult[];
}
