import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Course } from '../../courses/entities/course.entity';
import { ExamResult } from './exam-result.entity';
import { Lesson } from '../../courses/entities/lesson.entity';

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

  @ManyToOne(() => Lesson, (lesson) => lesson.id, { nullable: true })
  @JoinColumn({ name: 'lesson_id' })
  lesson: Lesson | null;

  @Column({ name: 'lesson_id', type: 'uuid', nullable: true })
  lessonId: string | null;

  @Column()
  title: string;

  @Column({
    type: 'enum',
    enum: ExamStatus,
    default: ExamStatus.IN_PROGRESS,
  })
  status: ExamStatus;

  @Column('float', { nullable: true })
  score: number | null;

  @Column()
  started_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  completed_at: Date | null;

  @OneToMany(() => ExamResult, (examResult) => examResult.exam)
  results: ExamResult[];
}
