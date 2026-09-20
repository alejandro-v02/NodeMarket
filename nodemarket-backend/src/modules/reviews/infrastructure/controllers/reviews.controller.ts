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
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../../../../shared/infrastructure/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../../../shared/infrastructure/decorators/current-user.decorator';
import { Roles } from '../../../../shared/infrastructure/decorators/roles.decorator';
import { JwtAuthGuard } from '../../../../shared/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../shared/infrastructure/guards/roles.guard';
import { UserRole } from '../../../users/domain/entities/user.entity';
import { CreateReviewDto } from '../../application/dtos/create-review.dto';
import { ReviewResponseDto } from '../../application/dtos/review-response.dto';
import { UpdateReviewDto } from '../../application/dtos/update-review.dto';
import { CreateReviewUseCase } from '../../application/use-cases/create-review.use-case';
import { DeleteReviewUseCase } from '../../application/use-cases/delete-review.use-case';
import { GetReviewUseCase } from '../../application/use-cases/get-review.use-case';
import { ListReviewsUseCase } from '../../application/use-cases/list-reviews.use-case';
import { UpdateReviewUseCase } from '../../application/use-cases/update-review.use-case';

@Controller('reviews')
export class ReviewsController {
  constructor(
    private readonly createReviewUseCase: CreateReviewUseCase,
    private readonly listReviewsUseCase: ListReviewsUseCase,
    private readonly getReviewUseCase: GetReviewUseCase,
    private readonly updateReviewUseCase: UpdateReviewUseCase,
    private readonly deleteReviewUseCase: DeleteReviewUseCase,
  ) {}

  @Get()
  async findAll(
    @Query('providerId') providerId?: string,
    @Query('clientId') clientId?: string,
  ): Promise<ReviewResponseDto[]> {
    const reviews = await this.listReviewsUseCase.execute({
      providerId,
      clientId,
    });
    return reviews.map((review) => ReviewResponseDto.fromDomain(review));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ReviewResponseDto> {
    const review = await this.getReviewUseCase.execute(id);
    return ReviewResponseDto.fromDomain(review);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CLIENT)
  @Post()
  async create(
    @Body() dto: CreateReviewDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ReviewResponseDto> {
    const review = await this.createReviewUseCase.execute(dto, user.userId);
    return ReviewResponseDto.fromDomain(review);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateReviewDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ReviewResponseDto> {
    const review = await this.updateReviewUseCase.execute(
      id,
      dto,
      user.userId,
      user.role,
    );
    return ReviewResponseDto.fromDomain(review);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<void> {
    await this.deleteReviewUseCase.execute(id, user.userId, user.role);
  }
}
