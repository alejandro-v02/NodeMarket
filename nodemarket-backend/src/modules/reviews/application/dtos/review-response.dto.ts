import { Review } from '../../domain/entities/review.entity';

export class ReviewResponseDto {
  id!: string;
  bookingId!: string;
  clientId!: string;
  providerId!: string;
  rating!: number;
  comment!: string | null;
  createdAt!: Date;

  static fromDomain(review: Review): ReviewResponseDto {
    const dto = new ReviewResponseDto();
    dto.id = review.id;
    dto.bookingId = review.bookingId;
    dto.clientId = review.clientId;
    dto.providerId = review.providerId;
    dto.rating = review.rating;
    dto.comment = review.comment;
    dto.createdAt = review.createdAt;
    return dto;
  }
}
