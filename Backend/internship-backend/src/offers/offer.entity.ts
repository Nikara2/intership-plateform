import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Company } from '../companies/company.entity';
import { Application } from '../applications/application.entity';

@Entity('internship_offers')
export class Offer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column()
  company_id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ nullable: true })
  location?: string;

  @Column({ nullable: true })
  duration?: string;

  @Column({ nullable: true, type: 'text' })
  requirements?: string;

  @Column({ type: 'date' })
  deadline: Date;

  @Column({ type: 'enum', enum: ['OPEN', 'CLOSED'], default: 'OPEN' })
  status: 'OPEN' | 'CLOSED';

  @OneToMany(() => Application, (application) => application.offer)
  applications: Application[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
