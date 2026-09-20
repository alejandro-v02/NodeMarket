import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRole } from '../../../users/domain/entities/user.entity';
import { SERVICE_REPOSITORY } from '../../domain/repositories/service.repository';
import type { ServiceRepository } from '../../domain/repositories/service.repository';

@Injectable()
export class DeactivateServiceUseCase {
  constructor(
    @Inject(SERVICE_REPOSITORY)
    private readonly serviceRepository: ServiceRepository,
  ) {}

  async execute(
    id: string,
    requesterId: string,
    requesterRole: UserRole,
  ): Promise<void> {
    const service = await this.serviceRepository.findById(id);
    if (!service) {
      throw new NotFoundException('Service not found');
    }

    if (
      requesterRole !== UserRole.ADMIN &&
      service.providerId !== requesterId
    ) {
      throw new ForbiddenException('You can only deactivate your own services');
    }

    service.deactivate();
    await this.serviceRepository.update(service);
  }
}
