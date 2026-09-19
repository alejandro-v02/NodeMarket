import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateCategoryUseCase } from './application/use-cases/create-category.use-case';
import { DeactivateCategoryUseCase } from './application/use-cases/deactivate-category.use-case';
import { GetCategoryUseCase } from './application/use-cases/get-category.use-case';
import { ListCategoriesUseCase } from './application/use-cases/list-categories.use-case';
import { UpdateCategoryUseCase } from './application/use-cases/update-category.use-case';
import { CATEGORY_REPOSITORY } from './domain/repositories/category.repository';
import { CategoriesController } from './infrastructure/controllers/categories.controller';
import { CategoryOrmEntity } from './infrastructure/persistence/category.orm-entity';
import { TypeOrmCategoryRepository } from './infrastructure/persistence/typeorm-category.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryOrmEntity])],
  controllers: [CategoriesController],
  providers: [
    CreateCategoryUseCase,
    ListCategoriesUseCase,
    GetCategoryUseCase,
    UpdateCategoryUseCase,
    DeactivateCategoryUseCase,
    {
      provide: CATEGORY_REPOSITORY,
      useClass: TypeOrmCategoryRepository,
    },
  ],
  exports: [CATEGORY_REPOSITORY],
})
export class CategoriesModule {}
