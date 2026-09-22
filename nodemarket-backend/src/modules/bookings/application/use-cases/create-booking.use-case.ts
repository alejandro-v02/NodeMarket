import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { SERVICE_REPOSITORY } from '../../../services/domain/repositories/service.repository';
import type { ServiceRepository } from '../../../services/domain/repositories/service.repository';
import { USER_REPOSITORY } from '../../../users/domain/repositories/user.repository';
import type { UserRepository } from '../../../users/domain/repositories/user.repository';
import { Booking, BookingStatus } from '../../domain/entities/booking.entity';
import { BOOKING_REPOSITORY } from '../../domain/repositories/booking.repository';
import type { BookingRepository } from '../../domain/repositories/booking.repository';
import { CreateBookingDto } from '../dtos/create-booking.dto';

@Injectable()
export class CreateBookingUseCase {
  constructor(
    @Inject(BOOKING_REPOSITORY)
    private readonly bookingRepository: BookingRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(SERVICE_REPOSITORY)
    private readonly serviceRepository: ServiceRepository,
  ) {}

  async execute(dto: CreateBookingDto, clientId: string): Promise<Booking> {
    const client = await this.userRepository.findById(clientId);
    if (!client || !client.isClient()) {
      throw new BadRequestException(
        'Only an existing client can create a booking',
      );
    }

    const service = await this.serviceRepository.findById(dto.serviceId);
    if (!service || !service.isActive) {
      throw new BadRequestException(
        'serviceId must reference an existing active service',
      );
    }

    const scheduledAt = new Date(dto.scheduledAt);
    if (scheduledAt.getTime() <= Date.now()) {
      throw new BadRequestException('scheduledAt must be in the future');
    }

    const booking = new Booking(
      randomUUID(),
      clientId,
      service.providerId,
      dto.serviceId,
      scheduledAt,
      dto.notes ?? null,
      BookingStatus.PENDING,
      new Date(),
    );

    return this.bookingRepository.save(booking);
  }
}
