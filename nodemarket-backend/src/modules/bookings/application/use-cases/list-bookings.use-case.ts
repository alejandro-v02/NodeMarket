import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { UserRole } from '../../../users/domain/entities/user.entity';
import { Booking } from '../../domain/entities/booking.entity';
import { BOOKING_REPOSITORY } from '../../domain/repositories/booking.repository';
import type { BookingRepository } from '../../domain/repositories/booking.repository';

export interface ListBookingsFilters {
  clientId?: string;
  providerId?: string;
}

@Injectable()
export class ListBookingsUseCase {
  constructor(
    @Inject(BOOKING_REPOSITORY)
    private readonly bookingRepository: BookingRepository,
  ) {}

  async execute(
    filters: ListBookingsFilters,
    requesterId: string,
    requesterRole: UserRole,
  ): Promise<Booking[]> {
    if (requesterRole === UserRole.ADMIN) {
      if (filters.clientId) {
        return this.bookingRepository.findByClientId(filters.clientId);
      }
      if (filters.providerId) {
        return this.bookingRepository.findByProviderId(filters.providerId);
      }
      return this.bookingRepository.findAll();
    }

    if (filters.clientId && filters.clientId === requesterId) {
      return this.bookingRepository.findByClientId(filters.clientId);
    }
    if (filters.providerId && filters.providerId === requesterId) {
      return this.bookingRepository.findByProviderId(filters.providerId);
    }

    throw new ForbiddenException('You can only list your own bookings');
  }
}
