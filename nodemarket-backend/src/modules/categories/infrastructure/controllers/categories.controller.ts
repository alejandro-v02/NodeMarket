import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '../../../users/domain/entities/user.entity';
import { Roles } from '../../../../shared/infrastructure/decorators/roles.decorator';
import { JwtAuthGuard } from '../../../../shared/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../shared/infrastructure/guards/roles.guard';
import { CategoryResponseDto } from '../../application/dtos/category-response.dto';
import { CreateCategoryDto } from '../../application/dtos/create-category.dto';
import { UpdateCategoryDto } from '../../application/dtos/update-category.dto';
import { CreateCategoryUseCase } from '../../application/use-cases/create-category.use-case';
import { DeactivateCategoryUseCase } from '../../application/use-cases/deactivate-category.use-case';
import { GetCategoryUseCase } from '../../application/use-cases/get-category.use-case';
import { ListCategoriesUseCase } from '../../application/use-cases/list-categories.use-case';
import { UpdateCategoryUseCase } from '../../application/use-cases/update-category.use-case';

@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    private readonly listCategoriesUseCase: ListCategoriesUseCase,
    private readonly getCategoryUseCase: GetCategoryUseCase,
    private readonly updateCategoryUseCase: UpdateCategoryUseCase,
    private readonly deactivateCategoryUseCase: DeactivateCategoryUseCase,
  ) {}

  @Get()
  async findAll(): Promise<CategoryResponseDto[]> {
    const categories = await this.listCategoriesUseCase.execute();
    return categories.map((category) =>
      CategoryResponseDto.fromDomain(category),
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<CategoryResponseDto> {
    const category = await this.getCategoryUseCase.execute(id);
    return CategoryResponseDto.fromDomain(category);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  async create(@Body() dto: CreateCategoryDto): Promise<CategoryResponseDto> {
    const category = await this.createCategoryUseCase.execute(dto);
    return CategoryResponseDto.fromDomain(category);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    const category = await this.updateCategoryUseCase.execute(id, dto);
    return CategoryResponseDto.fromDomain(category);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deactivate(@Param('id') id: string): Promise<void> {
    await this.deactivateCategoryUseCase.execute(id);
  }
}
