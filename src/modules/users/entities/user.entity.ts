import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Course } from '../../courses/entities/course.entity';
import { UserAnswer } from '../../questions/entities/user-answer.entity';
import { Exam } from '../../exams/entities/exam.entity';
import { ClarificationMessage } from '../../chat/entities/clarification-message.entity';
import { UserRole } from '../enums/user-role.enum';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  username: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar' })
  password_hash?: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ type: 'jsonb', nullable: true })
  settings: Record<string, any>;

  @OneToMany(() => Course, (course) => course.user)
  courses: Course[];

  @OneToMany(() => UserAnswer, (userAnswer) => userAnswer.user)
  answers: UserAnswer[];

  @OneToMany(() => Exam, (exam) => exam.user)
  exams: Exam[];

  @OneToMany(
    () => ClarificationMessage,
    (clarificationMessage) => clarificationMessage.user,
  )
  messages: ClarificationMessage[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
