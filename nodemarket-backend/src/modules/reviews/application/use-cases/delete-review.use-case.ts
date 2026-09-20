import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRole } from '../../../users/domain/entities/user.entity';
import { REVIEW_REPOSITORY } from '../../domain/repositories/review.repository';
import type { ReviewRepository } from '../../domain/repositories/review.repository';

@Injectable()
export class DeleteReviewUseCase {
  constructor(
    @Inject(REVIEW_REPOSITORY)
    private readonly reviewRepository: ReviewRepository,
  ) {}

  async execute(
    id: string,
    requesterId: string,
    requesterRole: UserRole,
  ): Promise<void> {
    const review = await this.reviewRepository.findById(id);
    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (requesterRole !== UserRole.ADMIN && review.clientId !== requesterId) {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    await this.reviewRepository.delete(id);
  }
}
