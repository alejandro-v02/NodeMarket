import {
  BadRequestException,
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
export class RejectBookingUseCase {
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

    if (
      requesterRole !== UserRole.ADMIN &&
      booking.providerId !== requesterId
    ) {
      throw new ForbiddenException('Only the booking provider can reject it');
    }

    try {
      booking.reject();
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }

    return this.bookingRepository.update(booking);
  }
}
