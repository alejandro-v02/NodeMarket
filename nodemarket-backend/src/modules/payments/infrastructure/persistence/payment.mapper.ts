import { Payment } from '../../domain/entities/payment.entity';
import { PaymentOrmEntity } from './payment.orm-entity';

export class PaymentMapper {
  static toDomain(ormEntity: PaymentOrmEntity): Payment {
    return new Payment(
      ormEntity.id,
      ormEntity.bookingId,
      ormEntity.clientId,
      ormEntity.providerId,
      ormEntity.amount,
      ormEntity.method,
      ormEntity.status,
      ormEntity.createdAt,
      ormEntity.paidAt,
    );
  }

  static toPersistence(domainPayment: Payment): PaymentOrmEntity {
    const ormEntity = new PaymentOrmEntity();
    ormEntity.id = domainPayment.id;
    ormEntity.bookingId = domainPayment.bookingId;
    ormEntity.clientId = domainPayment.clientId;
    ormEntity.providerId = domainPayment.providerId;
    ormEntity.amount = domainPayment.amount;
    ormEntity.method = domainPayment.method;
    ormEntity.status = domainPayment.status;
    ormEntity.createdAt = domainPayment.createdAt;
    ormEntity.paidAt = domainPayment.paidAt;
    return ormEntity;
  }
}
