import { Booking } from '../../domain/entities/booking.entity';
import { BookingOrmEntity } from './booking.orm-entity';

export class BookingMapper {
  static toDomain(ormEntity: BookingOrmEntity): Booking {
    return new Booking(
      ormEntity.id,
      ormEntity.clientId,
      ormEntity.providerId,
      ormEntity.serviceId,
      ormEntity.scheduledAt,
      ormEntity.notes,
      ormEntity.status,
      ormEntity.createdAt,
    );
  }

  static toPersistence(domainBooking: Booking): BookingOrmEntity {
    const ormEntity = new BookingOrmEntity();
    ormEntity.id = domainBooking.id;
    ormEntity.clientId = domainBooking.clientId;
    ormEntity.providerId = domainBooking.providerId;
    ormEntity.serviceId = domainBooking.serviceId;
    ormEntity.scheduledAt = domainBooking.scheduledAt;
    ormEntity.notes = domainBooking.notes;
    ormEntity.status = domainBooking.status;
    ormEntity.createdAt = domainBooking.createdAt;
    return ormEntity;
  }
}
