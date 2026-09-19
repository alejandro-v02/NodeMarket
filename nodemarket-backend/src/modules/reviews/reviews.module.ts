import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsModule } from '../bookings/bookings.module';
import { CreateReviewUseCase } from './application/use-cases/create-review.use-case';
import { DeleteReviewUseCase } from './application/use-cases/delete-review.use-case';
import { GetReviewUseCase } from './application/use-cases/get-review.use-case';
import { ListReviewsUseCase } from './application/use-cases/list-reviews.use-case';
import { UpdateReviewUseCase } from './application/use-cases/update-review.use-case';
import { REVIEW_REPOSITORY } from './domain/repositories/review.repository';
import { ReviewsController } from './infrastructure/controllers/reviews.controller';
import { ReviewOrmEntity } from './infrastructure/persistence/review.orm-entity';
import { TypeOrmReviewRepository } from './infrastructure/persistence/typeorm-review.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ReviewOrmEntity]), BookingsModule],
  controllers: [ReviewsController],
  providers: [
    CreateReviewUseCase,
    ListReviewsUseCase,
    GetReviewUseCase,
    UpdateReviewUseCase,
    DeleteReviewUseCase,
    {
      provide: REVIEW_REPOSITORY,
      useClass: TypeOrmReviewRepository,
    },
  ],
})
export class ReviewsModule {}
