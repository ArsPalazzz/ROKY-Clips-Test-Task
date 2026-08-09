import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from '../entities/payment.entity';
import { Subscription } from '../entities/subscription.entity';
import { User } from '../entities/user.entity';
import { PaymentRepository } from './payment.repository';
import { SubscriptionRepository } from './subscription.repository';
import { UserRepository } from './user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User, Payment, Subscription])],
  providers: [UserRepository, PaymentRepository, SubscriptionRepository],
  exports: [UserRepository, PaymentRepository, SubscriptionRepository],
})
export class RepositoriesModule {}
