import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../../domain/entities/review.entity';
import { ReviewRepository } from '../../domain/repositories/review.repository';
import { ReviewMapper } from './review.mapper';
import { ReviewOrmEntity } from './review.orm-entity';

@Injectable()
export class TypeOrmReviewRepository implements ReviewRepository {
  constructor(
    @InjectRepository(ReviewOrmEntity)
    private readonly ormRepository: Repository<ReviewOrmEntity>,
  ) {}

  async save(review: Review): Promise<Review> {
    const ormEntity = ReviewMapper.toPersistence(review);
    const saved = await this.ormRepository.save(ormEntity);
    return ReviewMapper.toDomain(saved);
  }

  async findById(id: string): Promise<Review | null> {
    const ormEntity = await this.ormRepository.findOneBy({ id });
    return ormEntity ? ReviewMapper.toDomain(ormEntity) : null;
  }

  async findByBookingId(bookingId: string): Promise<Review | null> {
    const ormEntity = await this.ormRepository.findOneBy({ bookingId });
    return ormEntity ? ReviewMapper.toDomain(ormEntity) : null;
  }

  async findByProviderId(providerId: string): Promise<Review[]> {
    const ormEntities = await this.ormRepository.findBy({ providerId });
    return ormEntities.map((ormEntity) => ReviewMapper.toDomain(ormEntity));
  }

  async findByClientId(clientId: string): Promise<Review[]> {
    const ormEntities = await this.ormRepository.findBy({ clientId });
    return ormEntities.map((ormEntity) => ReviewMapper.toDomain(ormEntity));
  }

  async update(review: Review): Promise<Review> {
    return this.save(review);
  }

  async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }
}
