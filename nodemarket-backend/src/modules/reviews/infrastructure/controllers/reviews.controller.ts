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
} from '@nestjs/common';
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

  @Post()
  async create(@Body() dto: CreateReviewDto): Promise<ReviewResponseDto> {
    const review = await this.createReviewUseCase.execute(dto);
    return ReviewResponseDto.fromDomain(review);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateReviewDto,
  ): Promise<ReviewResponseDto> {
    const review = await this.updateReviewUseCase.execute(id, dto);
    return ReviewResponseDto.fromDomain(review);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.deleteReviewUseCase.execute(id);
  }
}
