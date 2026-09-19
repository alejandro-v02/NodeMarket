import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Category } from '../../domain/entities/category.entity';
import { CATEGORY_REPOSITORY } from '../../domain/repositories/category.repository';
import type { CategoryRepository } from '../../domain/repositories/category.repository';
import { UpdateCategoryDto } from '../dtos/update-category.dto';

@Injectable()
export class UpdateCategoryUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(id: string, dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (dto.name && dto.name !== category.name) {
      const existing = await this.categoryRepository.findByName(dto.name);
      if (existing) {
        throw new ConflictException('Category name already exists');
      }
      category.rename(dto.name);
    }

    if (dto.description !== undefined) {
      category.description = dto.description;
    }

    return this.categoryRepository.update(category);
  }
}
