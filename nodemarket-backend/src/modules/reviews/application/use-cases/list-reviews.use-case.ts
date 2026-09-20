import { Inject, Injectable } from '@nestjs/common';
import { Review } from '../../domain/entities/review.entity';
import { REVIEW_REPOSITORY } from '../../domain/repositories/review.repository';
import type { ReviewRepository } from '../../domain/repositories/review.repository';

export interface ListReviewsFilters {
  providerId?: string;
  clientId?: string;
}

@Injectable()
export class ListReviewsUseCase {
  constructor(
    @Inject(REVIEW_REPOSITORY)
    private readonly reviewRepository: ReviewRepository,
  ) {}

  async execute(filters: ListReviewsFilters): Promise<Review[]> {
    if (filters.providerId) {
      return this.reviewRepository.findByProviderId(filters.providerId);
    }
    if (filters.clientId) {
      return this.reviewRepository.findByClientId(filters.clientId);
    }
    return [];
  }
}
