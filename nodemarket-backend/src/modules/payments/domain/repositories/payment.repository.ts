import { Payment } from '../entities/payment.entity';

export interface PaymentRepository {
  save(payment: Payment): Promise<Payment>;
  findById(id: string): Promise<Payment | null>;
  findByBookingId(bookingId: string): Promise<Payment | null>;
  findByClientId(clientId: string): Promise<Payment[]>;
  findByProviderId(providerId: string): Promise<Payment[]>;
  update(payment: Payment): Promise<Payment>;
}

export const PAYMENT_REPOSITORY = 'PAYMENT_REPOSITORY';
