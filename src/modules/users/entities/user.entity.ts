import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum UserGender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  firstName: string;

  @Column({ type: 'varchar', length: 50 })
  lastName: string;

  @Column({ type: 'int' })
  age: number;

  @Column({
    type: 'enum',
    enum: UserGender,
  })
  gender: UserGender;

  @Column({ type: 'varchar', nullable: true })
  avatarUrl: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar' })
  password?: string;
}
