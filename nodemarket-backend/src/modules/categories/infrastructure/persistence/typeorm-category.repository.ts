import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../domain/entities/category.entity';
import { CategoryRepository } from '../../domain/repositories/category.repository';
import { CategoryMapper } from './category.mapper';
import { CategoryOrmEntity } from './category.orm-entity';

@Injectable()
export class TypeOrmCategoryRepository implements CategoryRepository {
  constructor(
    @InjectRepository(CategoryOrmEntity)
    private readonly ormRepository: Repository<CategoryOrmEntity>,
  ) {}

  async save(category: Category): Promise<Category> {
    const ormEntity = CategoryMapper.toPersistence(category);
    const saved = await this.ormRepository.save(ormEntity);
    return CategoryMapper.toDomain(saved);
  }

  async findById(id: string): Promise<Category | null> {
    const ormEntity = await this.ormRepository.findOneBy({ id });
    return ormEntity ? CategoryMapper.toDomain(ormEntity) : null;
  }

  async findByName(name: string): Promise<Category | null> {
    const ormEntity = await this.ormRepository.findOneBy({ name });
    return ormEntity ? CategoryMapper.toDomain(ormEntity) : null;
  }

  async findAll(): Promise<Category[]> {
    const ormEntities = await this.ormRepository.find();
    return ormEntities.map((ormEntity) => CategoryMapper.toDomain(ormEntity));
  }

  async update(category: Category): Promise<Category> {
    return this.save(category);
  }

  async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }
}
