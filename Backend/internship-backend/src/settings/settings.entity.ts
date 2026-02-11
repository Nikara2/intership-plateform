import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('settings')
export class Settings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  // General Settings
  @Column({ default: 'fr' })
  language: string;

  @Column({ default: 'Europe/Paris' })
  timezone: string;

  @Column({ default: 'DD/MM/YYYY' })
  date_format: string;

  @Column({ default: 'light' })
  theme: string;

  // Notification Settings
  @Column({ default: true })
  email_notifications: boolean;

  @Column({ default: true })
  new_applications: boolean;

  @Column({ default: true })
  new_accounts: boolean;

  @Column({ default: true })
  weekly_report: boolean;

  @Column({ default: false })
  system_updates: boolean;

  // Platform Settings (only for SCHOOL_ADMIN)
  @Column({ default: true })
  allow_registration: boolean;

  @Column({ default: false })
  require_email_verification: boolean;

  @Column({ default: 30 })
  default_offer_duration: number;

  @Column({ default: 10 })
  max_applications_per_student: number;

  @Column({ default: true })
  auto_close_expired_offers: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
