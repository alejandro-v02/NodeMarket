import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../../domain/entities/payment.entity';
import { PaymentRepository } from '../../domain/repositories/payment.repository';
import { PaymentMapper } from './payment.mapper';
import { PaymentOrmEntity } from './payment.orm-entity';

@Injectable()
export class TypeOrmPaymentRepository implements PaymentRepository {
  constructor(
    @InjectRepository(PaymentOrmEntity)
    private readonly ormRepository: Repository<PaymentOrmEntity>,
  ) {}

  async save(payment: Payment): Promise<Payment> {
    const ormEntity = PaymentMapper.toPersistence(payment);
    const saved = await this.ormRepository.save(ormEntity);
    return PaymentMapper.toDomain(saved);
  }

  async findById(id: string): Promise<Payment | null> {
    const ormEntity = await this.ormRepository.findOneBy({ id });
    return ormEntity ? PaymentMapper.toDomain(ormEntity) : null;
  }

  async findByBookingId(bookingId: string): Promise<Payment | null> {
    const ormEntity = await this.ormRepository.findOneBy({ bookingId });
    return ormEntity ? PaymentMapper.toDomain(ormEntity) : null;
  }

  async findByClientId(clientId: string): Promise<Payment[]> {
    const ormEntities = await this.ormRepository.findBy({ clientId });
    return ormEntities.map((ormEntity) => PaymentMapper.toDomain(ormEntity));
  }

  async findByProviderId(providerId: string): Promise<Payment[]> {
    const ormEntities = await this.ormRepository.findBy({ providerId });
    return ormEntities.map((ormEntity) => PaymentMapper.toDomain(ormEntity));
  }

  async update(payment: Payment): Promise<Payment> {
    return this.save(payment);
  }
}
