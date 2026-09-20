import { Review } from '../entities/review.entity';

export interface ReviewRepository {
  save(review: Review): Promise<Review>;
  findById(id: string): Promise<Review | null>;
  findByBookingId(bookingId: string): Promise<Review | null>;
  findByProviderId(providerId: string): Promise<Review[]>;
  findByClientId(clientId: string): Promise<Review[]>;
  update(review: Review): Promise<Review>;
  delete(id: string): Promise<void>;
}

export const REVIEW_REPOSITORY = 'REVIEW_REPOSITORY';
