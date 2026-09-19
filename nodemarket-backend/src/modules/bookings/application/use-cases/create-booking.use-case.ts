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

  async execute(dto: CreateBookingDto): Promise<Booking> {
    const client = await this.userRepository.findById(dto.clientId);
    if (!client || !client.isClient()) {
      throw new BadRequestException(
        'clientId must reference an existing client',
      );
    }

    const service = await this.serviceRepository.findById(dto.serviceId);
    if (!service || !service.isActive) {
      throw new BadRequestException(
        'serviceId must reference an existing active service',
      );
    }

    const booking = new Booking(
      randomUUID(),
      dto.clientId,
      service.providerId,
      dto.serviceId,
      new Date(dto.scheduledAt),
      dto.notes ?? null,
      BookingStatus.PENDING,
      new Date(),
    );

    return this.bookingRepository.save(booking);
  }
}
