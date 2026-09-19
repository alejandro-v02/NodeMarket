import { Booking } from '../entities/booking.entity';

export interface BookingRepository {
  save(booking: Booking): Promise<Booking>;
  findById(id: string): Promise<Booking | null>;
  findAll(): Promise<Booking[]>;
  findByClientId(clientId: string): Promise<Booking[]>;
  findByProviderId(providerId: string): Promise<Booking[]>;
  update(booking: Booking): Promise<Booking>;
}

export const BOOKING_REPOSITORY = 'BOOKING_REPOSITORY';
