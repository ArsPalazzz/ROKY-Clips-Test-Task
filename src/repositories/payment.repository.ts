import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, QueryFailedError, Repository } from 'typeorm';
import { Payment } from '../entities/payment.entity';
import { DuplicatePaymentError } from './errors/duplicate-payment.error';

export interface CreatePaymentData {
  paymentId: string;
  userId: number;
  amount: number;
  status: string;
}

@Injectable()
export class PaymentRepository {
  constructor(
    @InjectRepository(Payment)
    private readonly repository: Repository<Payment>,
  ) {}

  private getRepository(manager?: EntityManager): Repository<Payment> {
    return manager ? manager.getRepository(Payment) : this.repository;
  }

  findByPaymentId(
    paymentId: string,
    manager?: EntityManager,
  ): Promise<Payment | null> {
    return this.getRepository(manager).findOne({ where: { paymentId } });
  }

  async createConfirmed(
    data: CreatePaymentData,
    manager?: EntityManager,
  ): Promise<Payment> {
    const repo = this.getRepository(manager);
    const payment = repo.create({
      paymentId: data.paymentId,
      userId: data.userId,
      amount: data.amount,
      status: data.status,
    });

    try {
      return await repo.save(payment);
    } catch (error) {
      if (this.isUniqueViolation(error)) {
        throw new DuplicatePaymentError(data.paymentId);
      }

      throw error;
    }
  }

  private isUniqueViolation(error: unknown): boolean {
    return (
      error instanceof QueryFailedError &&
      (error as QueryFailedError & { driverError?: { code?: string } })
        .driverError?.code === '23505'
    );
  }
}
