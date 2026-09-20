import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Review } from '../../domain/entities/review.entity';
import { REVIEW_REPOSITORY } from '../../domain/repositories/review.repository';
import type { ReviewRepository } from '../../domain/repositories/review.repository';

@Injectable()
export class GetReviewUseCase {
  constructor(
    @Inject(REVIEW_REPOSITORY)
    private readonly reviewRepository: ReviewRepository,
  ) {}

  async execute(id: string): Promise<Review> {
    const review = await this.reviewRepository.findById(id);
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    return review;
  }
}
