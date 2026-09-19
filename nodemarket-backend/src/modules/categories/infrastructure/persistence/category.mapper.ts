import { Category } from '../../domain/entities/category.entity';
import { CategoryOrmEntity } from './category.orm-entity';

export class CategoryMapper {
  static toDomain(ormEntity: CategoryOrmEntity): Category {
    return new Category(
      ormEntity.id,
      ormEntity.name,
      ormEntity.description,
      ormEntity.createdAt,
      ormEntity.isActive,
    );
  }

  static toPersistence(domainCategory: Category): CategoryOrmEntity {
    const ormEntity = new CategoryOrmEntity();
    ormEntity.id = domainCategory.id;
    ormEntity.name = domainCategory.name;
    ormEntity.description = domainCategory.description;
    ormEntity.createdAt = domainCategory.createdAt;
    ormEntity.isActive = domainCategory.isActive;
    return ormEntity;
  }
}
