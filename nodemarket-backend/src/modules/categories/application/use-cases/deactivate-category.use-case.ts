import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CATEGORY_REPOSITORY } from '../../domain/repositories/category.repository';
import type { CategoryRepository } from '../../domain/repositories/category.repository';

@Injectable()
export class DeactivateCategoryUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    category.deactivate();
    await this.categoryRepository.update(category);
  }
}
