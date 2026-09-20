import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { UserRole } from '../../../users/domain/entities/user.entity';
import { Payment } from '../../domain/entities/payment.entity';
import { PAYMENT_REPOSITORY } from '../../domain/repositories/payment.repository';
import type { PaymentRepository } from '../../domain/repositories/payment.repository';

export interface ListPaymentsFilters {
  clientId?: string;
  providerId?: string;
}

@Injectable()
export class ListPaymentsUseCase {
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: PaymentRepository,
  ) {}

  async execute(
    filters: ListPaymentsFilters,
    requesterId: string,
    requesterRole: UserRole,
  ): Promise<Payment[]> {
    if (requesterRole === UserRole.ADMIN) {
      if (filters.clientId) {
        return this.paymentRepository.findByClientId(filters.clientId);
      }
      if (filters.providerId) {
        return this.paymentRepository.findByProviderId(filters.providerId);
      }
      throw new ForbiddenException(
        'Filter by clientId or providerId to list payments',
      );
    }

    if (filters.clientId && filters.clientId === requesterId) {
      return this.paymentRepository.findByClientId(filters.clientId);
    }
    if (filters.providerId && filters.providerId === requesterId) {
      return this.paymentRepository.findByProviderId(filters.providerId);
    }

    throw new ForbiddenException('You can only list your own payments');
  }
}
