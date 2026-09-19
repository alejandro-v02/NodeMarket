import { Inject, Injectable } from '@nestjs/common';
import { Service } from '../../domain/entities/service.entity';
import { SERVICE_REPOSITORY } from '../../domain/repositories/service.repository';
import type { ServiceRepository } from '../../domain/repositories/service.repository';

export interface ListServicesFilters {
  providerId?: string;
  categoryId?: string;
}

@Injectable()
export class ListServicesUseCase {
  constructor(
    @Inject(SERVICE_REPOSITORY)
    private readonly serviceRepository: ServiceRepository,
  ) {}

  async execute(filters: ListServicesFilters = {}): Promise<Service[]> {
    if (filters.providerId) {
      return this.serviceRepository.findByProviderId(filters.providerId);
    }
    if (filters.categoryId) {
      return this.serviceRepository.findByCategoryId(filters.categoryId);
    }
    return this.serviceRepository.findAll();
  }
}
