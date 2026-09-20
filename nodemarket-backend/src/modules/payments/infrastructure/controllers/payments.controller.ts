import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../../../../shared/infrastructure/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../../../shared/infrastructure/decorators/current-user.decorator';
import { Roles } from '../../../../shared/infrastructure/decorators/roles.decorator';
import { JwtAuthGuard } from '../../../../shared/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../shared/infrastructure/guards/roles.guard';
import { UserRole } from '../../../users/domain/entities/user.entity';
import { CreatePaymentDto } from '../../application/dtos/create-payment.dto';
import { PaymentResponseDto } from '../../application/dtos/payment-response.dto';
import { CreatePaymentUseCase } from '../../application/use-cases/create-payment.use-case';
import { GetPaymentUseCase } from '../../application/use-cases/get-payment.use-case';
import { ListPaymentsUseCase } from '../../application/use-cases/list-payments.use-case';
import { MarkPaymentFailedUseCase } from '../../application/use-cases/mark-payment-failed.use-case';
import { MarkPaymentPaidUseCase } from '../../application/use-cases/mark-payment-paid.use-case';
import { RefundPaymentUseCase } from '../../application/use-cases/refund-payment.use-case';

@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly createPaymentUseCase: CreatePaymentUseCase,
    private readonly listPaymentsUseCase: ListPaymentsUseCase,
    private readonly getPaymentUseCase: GetPaymentUseCase,
    private readonly markPaymentPaidUseCase: MarkPaymentPaidUseCase,
    private readonly markPaymentFailedUseCase: MarkPaymentFailedUseCase,
    private readonly refundPaymentUseCase: RefundPaymentUseCase,
  ) {}

  @Get()
  async findAll(
    @Query('clientId') clientId: string | undefined,
    @Query('providerId') providerId: string | undefined,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<PaymentResponseDto[]> {
    const payments = await this.listPaymentsUseCase.execute(
      { clientId, providerId },
      user.userId,
      user.role,
    );
    return payments.map((payment) => PaymentResponseDto.fromDomain(payment));
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<PaymentResponseDto> {
    const payment = await this.getPaymentUseCase.execute(
      id,
      user.userId,
      user.role,
    );
    return PaymentResponseDto.fromDomain(payment);
  }

  @Roles(UserRole.CLIENT)
  @UseGuards(RolesGuard)
  @Post()
  async create(
    @Body() dto: CreatePaymentDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<PaymentResponseDto> {
    const payment = await this.createPaymentUseCase.execute(dto, user.userId);
    return PaymentResponseDto.fromDomain(payment);
  }

  @Patch(':id/mark-paid')
  async markPaid(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<PaymentResponseDto> {
    const payment = await this.markPaymentPaidUseCase.execute(
      id,
      user.userId,
      user.role,
    );
    return PaymentResponseDto.fromDomain(payment);
  }

  @Patch(':id/mark-failed')
  async markFailed(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<PaymentResponseDto> {
    const payment = await this.markPaymentFailedUseCase.execute(
      id,
      user.userId,
      user.role,
    );
    return PaymentResponseDto.fromDomain(payment);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Patch(':id/refund')
  async refund(@Param('id') id: string): Promise<PaymentResponseDto> {
    const payment = await this.refundPaymentUseCase.execute(id);
    return PaymentResponseDto.fromDomain(payment);
  }
}
