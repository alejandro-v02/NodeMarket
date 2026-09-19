import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { BookingStatus } from '../../../bookings/domain/entities/booking.entity';
import { BOOKING_REPOSITORY } from '../../../bookings/domain/repositories/booking.repository';
import type { BookingRepository } from '../../../bookings/domain/repositories/booking.repository';
import { Review } from '../../domain/entities/review.entity';
import { REVIEW_REPOSITORY } from '../../domain/repositories/review.repository';
import type { ReviewRepository } from '../../domain/repositories/review.repository';
import { CreateReviewDto } from '../dtos/create-review.dto';

@Injectable()
export class CreateReviewUseCase {
  constructor(
    @Inject(REVIEW_REPOSITORY)
    private readonly reviewRepository: ReviewRepository,
    @Inject(BOOKING_REPOSITORY)
    private readonly bookingRepository: BookingRepository,
  ) {}

  async execute(dto: CreateReviewDto): Promise<Review> {
    const booking = await this.bookingRepository.findById(dto.bookingId);
    if (!booking) {
      throw new BadRequestException(
        'bookingId must reference an existing booking',
      );
    }

    if (booking.clientId !== dto.clientId) {
      throw new BadRequestException(
        "clientId does not match the booking's client",
      );
    }

    if (booking.status !== BookingStatus.COMPLETED) {
      throw new BadRequestException('Only completed bookings can be reviewed');
    }

    const existingReview = await this.reviewRepository.findByBookingId(
      dto.bookingId,
    );
    if (existingReview) {
      throw new ConflictException('This booking has already been reviewed');
    }

    const review = new Review(
      randomUUID(),
      dto.bookingId,
      dto.clientId,
      booking.providerId,
      dto.rating,
      dto.comment ?? null,
      new Date(),
    );

    return this.reviewRepository.save(review);
  }
}
