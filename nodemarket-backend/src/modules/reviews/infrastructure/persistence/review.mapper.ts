import { Review } from '../../domain/entities/review.entity';
import { ReviewOrmEntity } from './review.orm-entity';

export class ReviewMapper {
  static toDomain(ormEntity: ReviewOrmEntity): Review {
    return new Review(
      ormEntity.id,
      ormEntity.bookingId,
      ormEntity.clientId,
      ormEntity.providerId,
      ormEntity.rating,
      ormEntity.comment,
      ormEntity.createdAt,
    );
  }

  static toPersistence(domainReview: Review): ReviewOrmEntity {
    const ormEntity = new ReviewOrmEntity();
    ormEntity.id = domainReview.id;
    ormEntity.bookingId = domainReview.bookingId;
    ormEntity.clientId = domainReview.clientId;
    ormEntity.providerId = domainReview.providerId;
    ormEntity.rating = domainReview.rating;
    ormEntity.comment = domainReview.comment;
    ormEntity.createdAt = domainReview.createdAt;
    return ormEntity;
  }
}
