import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from '../../domain/entities/service.entity';
import { ServiceRepository } from '../../domain/repositories/service.repository';
import { ServiceMapper } from './service.mapper';
import { ServiceOrmEntity } from './service.orm-entity';

@Injectable()
export class TypeOrmServiceRepository implements ServiceRepository {
  constructor(
    @InjectRepository(ServiceOrmEntity)
    private readonly ormRepository: Repository<ServiceOrmEntity>,
  ) {}

  async save(service: Service): Promise<Service> {
    const ormEntity = ServiceMapper.toPersistence(service);
    const saved = await this.ormRepository.save(ormEntity);
    return ServiceMapper.toDomain(saved);
  }

  async findById(id: string): Promise<Service | null> {
    const ormEntity = await this.ormRepository.findOneBy({ id });
    return ormEntity ? ServiceMapper.toDomain(ormEntity) : null;
  }

  async findAll(): Promise<Service[]> {
    const ormEntities = await this.ormRepository.find();
    return ormEntities.map((ormEntity) => ServiceMapper.toDomain(ormEntity));
  }

  async findByProviderId(providerId: string): Promise<Service[]> {
    const ormEntities = await this.ormRepository.findBy({ providerId });
    return ormEntities.map((ormEntity) => ServiceMapper.toDomain(ormEntity));
  }

  async findByCategoryId(categoryId: string): Promise<Service[]> {
    const ormEntities = await this.ormRepository.findBy({ categoryId });
    return ormEntities.map((ormEntity) => ServiceMapper.toDomain(ormEntity));
  }

  async update(service: Service): Promise<Service> {
    return this.save(service);
  }

  async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }
}
