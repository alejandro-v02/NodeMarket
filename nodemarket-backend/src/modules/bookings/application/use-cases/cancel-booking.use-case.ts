import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NotificationType } from '../../../notifications/domain/entities/notification.entity';
import { CreateNotificationUseCase } from '../../../notifications/application/use-cases/create-notification.use-case';
import { UserRole } from '../../../users/domain/entities/user.entity';
import { Booking } from '../../domain/entities/booking.entity';
import { BOOKING_REPOSITORY } from '../../domain/repositories/booking.repository';
import type { BookingRepository } from '../../domain/repositories/booking.repository';

@Injectable()
export class CancelBookingUseCase {
  constructor(
    @Inject(BOOKING_REPOSITORY)
    private readonly bookingRepository: BookingRepository,
    private readonly createNotificationUseCase: CreateNotificationUseCase,
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
      throw new ForbiddenException(
        'Only the client or provider can cancel this booking',
      );
    }

    try {
      booking.cancel();
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }

    const updated = await this.bookingRepository.update(booking);

    const recipients = new Set<string>();
    if (requesterId !== updated.clientId) {
      recipients.add(updated.clientId);
    }
    if (requesterId !== updated.providerId) {
      recipients.add(updated.providerId);
    }

    for (const userId of recipients) {
      await this.createNotificationUseCase.execute({
        userId,
        type: NotificationType.BOOKING_CANCELLED,
        title: 'Booking cancelled',
        message: 'This booking was cancelled.',
        relatedId: updated.id,
      });
    }

    return updated;
  }
}
