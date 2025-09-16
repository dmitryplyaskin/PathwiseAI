import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Course } from './course.entity';
import { Lesson } from './lesson.entity';

@Entity({ name: 'units' })
export class Unit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Course, (course) => course.units)
  course: Course;

  @Column()
  title: string;

  @Column('int')
  order: number;

  @OneToMany(() => Lesson, (lesson) => lesson.unit)
  lessons: Lesson[];

  @CreateDateColumn()
  created_at: Date;
}
