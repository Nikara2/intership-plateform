import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Unique,
  JoinColumn,
} from 'typeorm';
import { Student } from '../students/student.entity';
import { Offer } from '../offers/offer.entity';

@Entity('applications')
@Unique(['student_id', 'offer_id'])
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Student, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column()
  student_id: string;

  @ManyToOne(() => Offer, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'offer_id' })
  offer: Offer;

  @Column()
  offer_id: string;

  @Column({
    type: 'enum',
    enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED'],
    default: 'PENDING',
  })
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED';

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  applied_at: Date;
}
