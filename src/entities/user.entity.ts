import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Payment } from './payment.entity';
import { Subscription } from './subscription.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => Payment, (payment) => payment.user)
  payments: Payment[];

  @OneToMany(() => Subscription, (subscription) => subscription.user)
  subscriptions: Subscription[];
}
