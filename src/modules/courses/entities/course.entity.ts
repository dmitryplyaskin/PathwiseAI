import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Unit } from './unit.entity';
import { Exam } from '../../exams/entities/exam.entity';

export enum CourseStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

@Entity({ name: 'courses' })
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({
    type: 'enum',
    enum: CourseStatus,
    default: CourseStatus.NOT_STARTED,
  })
  status: CourseStatus;

  @Column('float', { default: 0 })
  progress: number;

  @OneToMany(() => Unit, (unit) => unit.course)
  units: Unit[];

  @OneToMany(() => Exam, (exam) => exam.course)
  exams: Exam[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
