import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CATEGORY_REPOSITORY } from '../../../categories/domain/repositories/category.repository';
import type { CategoryRepository } from '../../../categories/domain/repositories/category.repository';
import { USER_REPOSITORY } from '../../../users/domain/repositories/user.repository';
import type { UserRepository } from '../../../users/domain/repositories/user.repository';
import { Service } from '../../domain/entities/service.entity';
import { SERVICE_REPOSITORY } from '../../domain/repositories/service.repository';
import type { ServiceRepository } from '../../domain/repositories/service.repository';
import { CreateServiceDto } from '../dtos/create-service.dto';

@Injectable()
export class CreateServiceUseCase {
  constructor(
    @Inject(SERVICE_REPOSITORY)
    private readonly serviceRepository: ServiceRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(dto: CreateServiceDto): Promise<Service> {
    const provider = await this.userRepository.findById(dto.providerId);
    if (!provider || !provider.isProvider()) {
      throw new BadRequestException(
        'providerId must reference an existing provider',
      );
    }

    const category = await this.categoryRepository.findById(dto.categoryId);
    if (!category || !category.isActive) {
      throw new BadRequestException(
        'categoryId must reference an existing active category',
      );
    }

    const service = new Service(
      randomUUID(),
      dto.providerId,
      dto.categoryId,
      dto.title,
      dto.description,
      dto.price,
      new Date(),
    );

    return this.serviceRepository.save(service);
  }
}
