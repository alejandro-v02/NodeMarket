import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from '../../domain/entities/booking.entity';
import { BookingRepository } from '../../domain/repositories/booking.repository';
import { BookingMapper } from './booking.mapper';
import { BookingOrmEntity } from './booking.orm-entity';

@Injectable()
export class TypeOrmBookingRepository implements BookingRepository {
  constructor(
    @InjectRepository(BookingOrmEntity)
    private readonly ormRepository: Repository<BookingOrmEntity>,
  ) {}

  async save(booking: Booking): Promise<Booking> {
    const ormEntity = BookingMapper.toPersistence(booking);
    const saved = await this.ormRepository.save(ormEntity);
    return BookingMapper.toDomain(saved);
  }

  async findById(id: string): Promise<Booking | null> {
    const ormEntity = await this.ormRepository.findOneBy({ id });
    return ormEntity ? BookingMapper.toDomain(ormEntity) : null;
  }

  async findAll(): Promise<Booking[]> {
    const ormEntities = await this.ormRepository.find();
    return ormEntities.map((ormEntity) => BookingMapper.toDomain(ormEntity));
  }

  async findByClientId(clientId: string): Promise<Booking[]> {
    const ormEntities = await this.ormRepository.findBy({ clientId });
    return ormEntities.map((ormEntity) => BookingMapper.toDomain(ormEntity));
  }

  async findByProviderId(providerId: string): Promise<Booking[]> {
    const ormEntities = await this.ormRepository.findBy({ providerId });
    return ormEntities.map((ormEntity) => BookingMapper.toDomain(ormEntity));
  }

  async update(booking: Booking): Promise<Booking> {
    return this.save(booking);
  }
}
