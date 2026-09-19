import { Booking, BookingStatus } from '../../domain/entities/booking.entity';

export class BookingResponseDto {
  id!: string;
  clientId!: string;
  providerId!: string;
  serviceId!: string;
  scheduledAt!: Date;
  notes!: string | null;
  status!: BookingStatus;
  createdAt!: Date;

  static fromDomain(booking: Booking): BookingResponseDto {
    const dto = new BookingResponseDto();
    dto.id = booking.id;
    dto.clientId = booking.clientId;
    dto.providerId = booking.providerId;
    dto.serviceId = booking.serviceId;
    dto.scheduledAt = booking.scheduledAt;
    dto.notes = booking.notes;
    dto.status = booking.status;
    dto.createdAt = booking.createdAt;
    return dto;
  }
}
