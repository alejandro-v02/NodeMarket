import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { BookingStatus } from '../../../bookings/domain/entities/booking.entity';
import { BOOKING_REPOSITORY } from '../../../bookings/domain/repositories/booking.repository';
import type { BookingRepository } from '../../../bookings/domain/repositories/booking.repository';
import { SERVICE_REPOSITORY } from '../../../services/domain/repositories/service.repository';
import type { ServiceRepository } from '../../../services/domain/repositories/service.repository';
import { Payment, PaymentStatus } from '../../domain/entities/payment.entity';
import { PAYMENT_REPOSITORY } from '../../domain/repositories/payment.repository';
import type { PaymentRepository } from '../../domain/repositories/payment.repository';
import { CreatePaymentDto } from '../dtos/create-payment.dto';

@Injectable()
export class CreatePaymentUseCase {
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: PaymentRepository,
    @Inject(BOOKING_REPOSITORY)
    private readonly bookingRepository: BookingRepository,
    @Inject(SERVICE_REPOSITORY)
    private readonly serviceRepository: ServiceRepository,
  ) {}

  async execute(dto: CreatePaymentDto, clientId: string): Promise<Payment> {
    const booking = await this.bookingRepository.findById(dto.bookingId);
    if (!booking) {
      throw new BadRequestException(
        'bookingId must reference an existing booking',
      );
    }

    if (booking.clientId !== clientId) {
      throw new ForbiddenException('You can only pay for your own bookings');
    }

    if (
      booking.status !== BookingStatus.ACCEPTED &&
      booking.status !== BookingStatus.COMPLETED
    ) {
      throw new BadRequestException(
        'Only accepted or completed bookings can be paid',
      );
    }

    const existingPayment = await this.paymentRepository.findByBookingId(
      dto.bookingId,
    );
    if (existingPayment) {
      throw new ConflictException('This booking already has a payment');
    }

    const service = await this.serviceRepository.findById(booking.serviceId);
    if (!service) {
      throw new BadRequestException(
        'The booking references a service that no longer exists',
      );
    }

    const payment = new Payment(
      randomUUID(),
      booking.id,
      clientId,
      booking.providerId,
      service.price,
      dto.method,
      PaymentStatus.PENDING,
      new Date(),
      null,
    );

    return this.paymentRepository.save(payment);
  }
}
