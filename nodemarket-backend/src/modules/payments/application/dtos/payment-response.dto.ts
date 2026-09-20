import {
  Payment,
  PaymentMethod,
  PaymentStatus,
} from '../../domain/entities/payment.entity';

export class PaymentResponseDto {
  id!: string;
  bookingId!: string;
  clientId!: string;
  providerId!: string;
  amount!: number;
  method!: PaymentMethod;
  status!: PaymentStatus;
  createdAt!: Date;
  paidAt!: Date | null;

  static fromDomain(payment: Payment): PaymentResponseDto {
    const dto = new PaymentResponseDto();
    dto.id = payment.id;
    dto.bookingId = payment.bookingId;
    dto.clientId = payment.clientId;
    dto.providerId = payment.providerId;
    dto.amount = payment.amount;
    dto.method = payment.method;
    dto.status = payment.status;
    dto.createdAt = payment.createdAt;
    dto.paidAt = payment.paidAt;
    return dto;
  }
}
