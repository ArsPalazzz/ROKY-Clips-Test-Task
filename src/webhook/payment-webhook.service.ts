import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';
import { DuplicatePaymentError } from '../repositories/errors/duplicate-payment.error';
import { PaymentRepository } from '../repositories/payment.repository';
import { SubscriptionRepository } from '../repositories/subscription.repository';
import { UserRepository } from '../repositories/user.repository';
import { PaymentWebhookDto } from './dto/payment-webhook.dto';

const CONFIRMED_STATUS = 'CONFIRMED';
const SUBSCRIPTION_DAYS = 30;

export interface PaymentWebhookResult {
  processed: boolean;
  duplicate: boolean;
}

@Injectable()
export class PaymentWebhookService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly userRepository: UserRepository,
    private readonly paymentRepository: PaymentRepository,
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

  async handlePaymentWebhook(
    dto: PaymentWebhookDto,
  ): Promise<PaymentWebhookResult> {
    if (dto.status !== CONFIRMED_STATUS) {
      return { processed: false, duplicate: false };
    }

    try {
      const processed = await this.dataSource.transaction(async (manager) =>
        this.processConfirmedPayment(dto, manager),
      );

      return { processed, duplicate: !processed };
    } catch (error) {
      if (error instanceof DuplicatePaymentError) {
        return { processed: false, duplicate: true };
      }

      throw error;
    }
  }

  private async processConfirmedPayment(
    dto: PaymentWebhookDto,
    manager: EntityManager,
  ): Promise<boolean> {
    const existingPayment = await this.paymentRepository.findByPaymentId(
      dto.payment_id,
      manager,
    );

    if (existingPayment) {
      return false;
    }

    const user = await this.userRepository.findById(dto.user_id, manager);

    if (!user) {
      throw new NotFoundException(`User ${dto.user_id} not found`);
    }

    await this.paymentRepository.createConfirmed(
      {
        paymentId: dto.payment_id,
        userId: dto.user_id,
        amount: dto.amount,
        status: dto.status,
      },
      manager,
    );

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + SUBSCRIPTION_DAYS);

    await this.subscriptionRepository.activateForUser(
      dto.user_id,
      expiresAt,
      manager,
    );

    return true;
  }
}
