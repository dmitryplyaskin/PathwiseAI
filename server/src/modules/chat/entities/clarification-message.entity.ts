import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Lesson } from '../../courses/entities/lesson.entity';
import { User } from '../../users/entities/user.entity';

export enum SenderType {
  USER = 'user',
  LLM = 'llm',
}

@Entity({ name: 'clarification_messages' })
export class ClarificationMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Lesson, (lesson) => lesson.messages)
  lesson: Lesson;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @Column({
    type: 'enum',
    enum: SenderType,
  })
  sender: SenderType;

  @Column('text')
  message_text: string;

  @CreateDateColumn()
  created_at: Date;
}
