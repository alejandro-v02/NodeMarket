import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Service } from '../../domain/entities/service.entity';
import { SERVICE_REPOSITORY } from '../../domain/repositories/service.repository';
import type { ServiceRepository } from '../../domain/repositories/service.repository';

@Injectable()
export class GetServiceUseCase {
  constructor(
    @Inject(SERVICE_REPOSITORY)
    private readonly serviceRepository: ServiceRepository,
  ) {}

  async execute(id: string): Promise<Service> {
    const service = await this.serviceRepository.findById(id);
    if (!service) {
      throw new NotFoundException('Service not found');
    }
    return service;
  }
}
