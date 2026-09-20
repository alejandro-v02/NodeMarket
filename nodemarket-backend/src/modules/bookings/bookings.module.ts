import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesModule } from '../services/services.module';
import { UsersModule } from '../users/users.module';
import { AcceptBookingUseCase } from './application/use-cases/accept-booking.use-case';
import { CancelBookingUseCase } from './application/use-cases/cancel-booking.use-case';
import { CompleteBookingUseCase } from './application/use-cases/complete-booking.use-case';
import { CreateBookingUseCase } from './application/use-cases/create-booking.use-case';
import { GetBookingUseCase } from './application/use-cases/get-booking.use-case';
import { ListBookingsUseCase } from './application/use-cases/list-bookings.use-case';
import { RejectBookingUseCase } from './application/use-cases/reject-booking.use-case';
import { BOOKING_REPOSITORY } from './domain/repositories/booking.repository';
import { BookingsController } from './infrastructure/controllers/bookings.controller';
import { BookingOrmEntity } from './infrastructure/persistence/booking.orm-entity';
import { TypeOrmBookingRepository } from './infrastructure/persistence/typeorm-booking.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookingOrmEntity]),
    UsersModule,
    ServicesModule,
  ],
  controllers: [BookingsController],
  providers: [
    CreateBookingUseCase,
    ListBookingsUseCase,
    GetBookingUseCase,
    AcceptBookingUseCase,
    RejectBookingUseCase,
    CompleteBookingUseCase,
    CancelBookingUseCase,
    {
      provide: BOOKING_REPOSITORY,
      useClass: TypeOrmBookingRepository,
    },
  ],
  exports: [BOOKING_REPOSITORY],
})
export class BookingsModule {}
