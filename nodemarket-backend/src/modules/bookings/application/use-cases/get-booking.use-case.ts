import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRole } from '../../../users/domain/entities/user.entity';
import { Booking } from '../../domain/entities/booking.entity';
import { BOOKING_REPOSITORY } from '../../domain/repositories/booking.repository';
import type { BookingRepository } from '../../domain/repositories/booking.repository';

@Injectable()
export class GetBookingUseCase {
  constructor(
    @Inject(BOOKING_REPOSITORY)
    private readonly bookingRepository: BookingRepository,
  ) {}

  async execute(
    id: string,
    requesterId: string,
    requesterRole: UserRole,
  ): Promise<Booking> {
    const booking = await this.bookingRepository.findById(id);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const isParticipant =
      booking.clientId === requesterId || booking.providerId === requesterId;
    if (requesterRole !== UserRole.ADMIN && !isParticipant) {
      throw new ForbiddenException('You can only view your own bookings');
    }

    return booking;
  }
}
