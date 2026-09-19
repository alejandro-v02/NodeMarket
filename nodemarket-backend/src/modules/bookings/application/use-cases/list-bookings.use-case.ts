import { Inject, Injectable } from '@nestjs/common';
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

  async execute(filters: ListBookingsFilters = {}): Promise<Booking[]> {
    if (filters.clientId) {
      return this.bookingRepository.findByClientId(filters.clientId);
    }
    if (filters.providerId) {
      return this.bookingRepository.findByProviderId(filters.providerId);
    }
    return this.bookingRepository.findAll();
  }
}
