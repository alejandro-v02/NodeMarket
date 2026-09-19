import { Service } from '../entities/service.entity';

export interface ServiceRepository {
  save(service: Service): Promise<Service>;
  findById(id: string): Promise<Service | null>;
  findAll(): Promise<Service[]>;
  findByProviderId(providerId: string): Promise<Service[]>;
  findByCategoryId(categoryId: string): Promise<Service[]>;
  update(service: Service): Promise<Service>;
  delete(id: string): Promise<void>;
}

export const SERVICE_REPOSITORY = 'SERVICE_REPOSITORY';
