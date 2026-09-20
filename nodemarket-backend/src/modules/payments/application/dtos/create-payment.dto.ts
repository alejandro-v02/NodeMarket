import { IsEnum, IsUUID } from 'class-validator';
import { PaymentMethod } from '../../domain/entities/payment.entity';

export class CreatePaymentDto {
  @IsUUID()
  bookingId!: string;

  @IsEnum(PaymentMethod)
  method!: PaymentMethod;
}
