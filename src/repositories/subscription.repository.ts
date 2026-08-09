import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Subscription } from '../entities/subscription.entity';

const ACTIVE_STATUS = 'active';

@Injectable()
export class SubscriptionRepository {
  constructor(
    @InjectRepository(Subscription)
    private readonly repository: Repository<Subscription>,
  ) {}

  private getRepository(manager?: EntityManager): Repository<Subscription> {
    return manager ? manager.getRepository(Subscription) : this.repository;
  }

  async activateForUser(
    userId: number,
    expiresAt: Date,
    manager?: EntityManager,
  ): Promise<Subscription> {
    const repo = this.getRepository(manager);
    let subscription = await repo.findOne({ where: { userId } });

    if (subscription) {
      subscription.status = ACTIVE_STATUS;
      subscription.expiresAt = expiresAt;
    } else {
      subscription = repo.create({
        userId,
        status: ACTIVE_STATUS,
        expiresAt,
      });
    }

    return repo.save(subscription);
  }
}
