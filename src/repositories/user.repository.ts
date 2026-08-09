import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  private getRepository(manager?: EntityManager): Repository<User> {
    return manager ? manager.getRepository(User) : this.repository;
  }

  findById(id: number, manager?: EntityManager): Promise<User | null> {
    return this.getRepository(manager).findOne({ where: { id } });
  }
}
