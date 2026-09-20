import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRole } from '../../../users/domain/entities/user.entity';
import { Review } from '../../domain/entities/review.entity';
import { REVIEW_REPOSITORY } from '../../domain/repositories/review.repository';
import type { ReviewRepository } from '../../domain/repositories/review.repository';
import { UpdateReviewDto } from '../dtos/update-review.dto';

@Injectable()
export class UpdateReviewUseCase {
  constructor(
    @Inject(REVIEW_REPOSITORY)
    private readonly reviewRepository: ReviewRepository,
  ) {}

  async execute(
    id: string,
    dto: UpdateReviewDto,
    requesterId: string,
    requesterRole: UserRole,
  ): Promise<Review> {
    const review = await this.reviewRepository.findById(id);
    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (requesterRole !== UserRole.ADMIN && review.clientId !== requesterId) {
      throw new ForbiddenException('You can only edit your own reviews');
    }

    review.update(
      dto.rating ?? review.rating,
      dto.comment !== undefined ? dto.comment : review.comment,
    );

    return this.reviewRepository.update(review);
  }
}
