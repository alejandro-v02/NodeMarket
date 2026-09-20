import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRole } from '../../../users/domain/entities/user.entity';
import { Payment } from '../../domain/entities/payment.entity';
import { PAYMENT_REPOSITORY } from '../../domain/repositories/payment.repository';
import type { PaymentRepository } from '../../domain/repositories/payment.repository';

@Injectable()
export class MarkPaymentPaidUseCase {
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: PaymentRepository,
  ) {}

  async execute(
    id: string,
    requesterId: string,
    requesterRole: UserRole,
  ): Promise<Payment> {
    const payment = await this.paymentRepository.findById(id);
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (
      requesterRole !== UserRole.ADMIN &&
      payment.providerId !== requesterId
    ) {
      throw new ForbiddenException(
        'Only the receiving provider can confirm this payment',
      );
    }

    try {
      payment.markAsPaid();
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }

    return this.paymentRepository.update(payment);
  }
}
