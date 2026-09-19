import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Booking } from '../../domain/entities/booking.entity';
import { BOOKING_REPOSITORY } from '../../domain/repositories/booking.repository';
import type { BookingRepository } from '../../domain/repositories/booking.repository';

@Injectable()
export class GetBookingUseCase {
  constructor(
    @Inject(BOOKING_REPOSITORY)
    private readonly bookingRepository: BookingRepository,
  ) {}

  async execute(id: string): Promise<Booking> {
    const booking = await this.bookingRepository.findById(id);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    return booking;
  }
}
