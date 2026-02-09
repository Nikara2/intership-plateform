import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('student_application_histories')
export class StudentApplicationHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  application_id: string;

  @Column()
  student_id: string;

  @Column()
  offer_id: string;

  @Column()
  company_id: string;

  @Column({ nullable: true })
  supervisor_id?: string;

  @Column()
  status: string;

  @Column({ type: 'timestamp' })
  applied_at: Date;

  @CreateDateColumn({ type: 'timestamp' })
  completed_at: Date;
}
