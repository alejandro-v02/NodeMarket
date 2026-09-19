import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SERVICE_REPOSITORY } from '../../domain/repositories/service.repository';
import type { ServiceRepository } from '../../domain/repositories/service.repository';

@Injectable()
export class DeactivateServiceUseCase {
  constructor(
    @Inject(SERVICE_REPOSITORY)
    private readonly serviceRepository: ServiceRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const service = await this.serviceRepository.findById(id);
    if (!service) {
      throw new NotFoundException('Service not found');
    }

    service.deactivate();
    await this.serviceRepository.update(service);
  }
}
