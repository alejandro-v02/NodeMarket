import { Category } from '../../domain/entities/category.entity';

export class CategoryResponseDto {
  id!: string;
  name!: string;
  description!: string | null;
  isActive!: boolean;
  createdAt!: Date;

  static fromDomain(category: Category): CategoryResponseDto {
    const dto = new CategoryResponseDto();
    dto.id = category.id;
    dto.name = category.name;
    dto.description = category.description;
    dto.isActive = category.isActive;
    dto.createdAt = category.createdAt;
    return dto;
  }
}
