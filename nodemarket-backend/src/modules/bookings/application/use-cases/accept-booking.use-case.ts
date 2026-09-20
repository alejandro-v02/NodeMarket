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
export class AcceptBookingUseCase {
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

    if (
      requesterRole !== UserRole.ADMIN &&
      booking.providerId !== requesterId
    ) {
      throw new ForbiddenException('Only the booking provider can accept it');
    }

    try {
      booking.accept();
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }

    const updated = await this.bookingRepository.update(booking);

    await this.createNotificationUseCase.execute({
      userId: updated.clientId,
      type: NotificationType.BOOKING_ACCEPTED,
      title: 'Booking accepted',
      message: 'Your booking request was accepted by the provider.',
      relatedId: updated.id,
    });

    return updated;
  }
}
