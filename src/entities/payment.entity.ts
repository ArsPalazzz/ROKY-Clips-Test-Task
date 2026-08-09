import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'payment_id', unique: true })
  paymentId: string;

  @Column({ name: 'user_id' })
  userId: number;

  @Column()
  amount: number;

  @Column()
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.payments)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
