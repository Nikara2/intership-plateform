import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('student_profiles')
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  school?: string;

  @Column({ nullable: true })
  program?: string;

  @Column({ nullable: true })
  level?: string;

  @Column({ nullable: true })
  cv_url?: string;
}
