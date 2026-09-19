import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CATEGORY_REPOSITORY } from '../../../categories/domain/repositories/category.repository';
import type { CategoryRepository } from '../../../categories/domain/repositories/category.repository';
import { Service } from '../../domain/entities/service.entity';
import { SERVICE_REPOSITORY } from '../../domain/repositories/service.repository';
import type { ServiceRepository } from '../../domain/repositories/service.repository';
import { UpdateServiceDto } from '../dtos/update-service.dto';

@Injectable()
export class UpdateServiceUseCase {
  constructor(
    @Inject(SERVICE_REPOSITORY)
    private readonly serviceRepository: ServiceRepository,
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(id: string, dto: UpdateServiceDto): Promise<Service> {
    const service = await this.serviceRepository.findById(id);
    if (!service) {
      throw new NotFoundException('Service not found');
    }

    if (dto.categoryId) {
      const category = await this.categoryRepository.findById(dto.categoryId);
      if (!category || !category.isActive) {
        throw new BadRequestException(
          'categoryId must reference an existing active category',
        );
      }
      service.changeCategory(dto.categoryId);
    }

    service.updateDetails(
      dto.title ?? service.title,
      dto.description ?? service.description,
      dto.price ?? service.price,
    );

    return this.serviceRepository.update(service);
  }
}
