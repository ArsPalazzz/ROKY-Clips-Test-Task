import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column()
  status: string;

  @Column({ name: 'expires_at', type: 'timestamptz' })
  expiresAt: Date;

  @ManyToOne(() => User, (user) => user.subscriptions)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
