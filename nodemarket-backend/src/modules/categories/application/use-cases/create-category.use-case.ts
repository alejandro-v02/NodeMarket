import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Category } from '../../domain/entities/category.entity';
import { CATEGORY_REPOSITORY } from '../../domain/repositories/category.repository';
import type { CategoryRepository } from '../../domain/repositories/category.repository';
import { CreateCategoryDto } from '../dtos/create-category.dto';

@Injectable()
export class CreateCategoryUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(dto: CreateCategoryDto): Promise<Category> {
    const existing = await this.categoryRepository.findByName(dto.name);
    if (existing) {
      throw new ConflictException('Category name already exists');
    }

    const category = new Category(
      randomUUID(),
      dto.name,
      dto.description ?? null,
      new Date(),
    );

    return this.categoryRepository.save(category);
  }
}
