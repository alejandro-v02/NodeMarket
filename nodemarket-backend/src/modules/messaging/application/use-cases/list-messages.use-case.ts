import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BOOKING_REPOSITORY } from '../../../bookings/domain/repositories/booking.repository';
import type { BookingRepository } from '../../../bookings/domain/repositories/booking.repository';
import { UserRole } from '../../../users/domain/entities/user.entity';
import { Message } from '../../domain/entities/message.entity';
import { MESSAGE_REPOSITORY } from '../../domain/repositories/message.repository';
import type { MessageRepository } from '../../domain/repositories/message.repository';

@Injectable()
export class ListMessagesUseCase {
  constructor(
    @Inject(MESSAGE_REPOSITORY)
    private readonly messageRepository: MessageRepository,
    @Inject(BOOKING_REPOSITORY)
    private readonly bookingRepository: BookingRepository,
  ) {}

  async execute(
    bookingId: string,
    requesterId: string,
    requesterRole: UserRole,
  ): Promise<Message[]> {
    const booking = await this.bookingRepository.findById(bookingId);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const isParticipant =
      booking.clientId === requesterId || booking.providerId === requesterId;
    if (requesterRole !== UserRole.ADMIN && !isParticipant) {
      throw new ForbiddenException(
        'You can only view messages on your own bookings',
      );
    }

    return this.messageRepository.findByBookingId(bookingId);
  }
}
