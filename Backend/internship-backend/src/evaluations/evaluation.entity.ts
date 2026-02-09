import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { Application } from '../applications/application.entity';
import { Supervisor } from '../supervisors/supervisor.entity';

@Entity('evaluations')
@Unique(['application_id'])
export class Evaluation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Application, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'application_id' })
  application: Application;

  @Column()
  application_id: string;

  @ManyToOne(() => Supervisor, { eager: true })
  @JoinColumn({ name: 'supervisor_id' })
  supervisor: Supervisor;

  @Column()
  supervisor_id: string;

  @Column({ type: 'int', default: 0 })
  score: number;

  @Column({ type: 'text', nullable: true })
  comment?: string;

  @CreateDateColumn()
  evaluated_at: Date;
}
