import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsModule } from '../bookings/bookings.module';
import { ServicesModule } from '../services/services.module';
import { CreatePaymentUseCase } from './application/use-cases/create-payment.use-case';
import { GetPaymentUseCase } from './application/use-cases/get-payment.use-case';
import { ListPaymentsUseCase } from './application/use-cases/list-payments.use-case';
import { MarkPaymentFailedUseCase } from './application/use-cases/mark-payment-failed.use-case';
import { MarkPaymentPaidUseCase } from './application/use-cases/mark-payment-paid.use-case';
import { RefundPaymentUseCase } from './application/use-cases/refund-payment.use-case';
import { PAYMENT_REPOSITORY } from './domain/repositories/payment.repository';
import { PaymentsController } from './infrastructure/controllers/payments.controller';
import { PaymentOrmEntity } from './infrastructure/persistence/payment.orm-entity';
import { TypeOrmPaymentRepository } from './infrastructure/persistence/typeorm-payment.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentOrmEntity]),
    BookingsModule,
    ServicesModule,
  ],
  controllers: [PaymentsController],
  providers: [
    CreatePaymentUseCase,
    ListPaymentsUseCase,
    GetPaymentUseCase,
    MarkPaymentPaidUseCase,
    MarkPaymentFailedUseCase,
    RefundPaymentUseCase,
    {
      provide: PAYMENT_REPOSITORY,
      useClass: TypeOrmPaymentRepository,
    },
  ],
})
export class PaymentsModule {}
