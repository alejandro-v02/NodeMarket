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
import { BookingResponseDto } from '../../application/dtos/booking-response.dto';
import { CreateBookingDto } from '../../application/dtos/create-booking.dto';
import { AcceptBookingUseCase } from '../../application/use-cases/accept-booking.use-case';
import { CancelBookingUseCase } from '../../application/use-cases/cancel-booking.use-case';
import { CompleteBookingUseCase } from '../../application/use-cases/complete-booking.use-case';
import { CreateBookingUseCase } from '../../application/use-cases/create-booking.use-case';
import { GetBookingUseCase } from '../../application/use-cases/get-booking.use-case';
import { ListBookingsUseCase } from '../../application/use-cases/list-bookings.use-case';
import { RejectBookingUseCase } from '../../application/use-cases/reject-booking.use-case';

@UseGuards(JwtAuthGuard)
@Controller('bookings')
export class BookingsController {
  constructor(
    private readonly createBookingUseCase: CreateBookingUseCase,
    private readonly listBookingsUseCase: ListBookingsUseCase,
    private readonly getBookingUseCase: GetBookingUseCase,
    private readonly acceptBookingUseCase: AcceptBookingUseCase,
    private readonly rejectBookingUseCase: RejectBookingUseCase,
    private readonly completeBookingUseCase: CompleteBookingUseCase,
    private readonly cancelBookingUseCase: CancelBookingUseCase,
  ) {}

  @Get()
  async findAll(
    @Query('clientId') clientId: string | undefined,
    @Query('providerId') providerId: string | undefined,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<BookingResponseDto[]> {
    const bookings = await this.listBookingsUseCase.execute(
      { clientId, providerId },
      user.userId,
      user.role,
    );
    return bookings.map((booking) => BookingResponseDto.fromDomain(booking));
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<BookingResponseDto> {
    const booking = await this.getBookingUseCase.execute(
      id,
      user.userId,
      user.role,
    );
    return BookingResponseDto.fromDomain(booking);
  }

  @Roles(UserRole.CLIENT)
  @UseGuards(RolesGuard)
  @Post()
  async create(
    @Body() dto: CreateBookingDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<BookingResponseDto> {
    const booking = await this.createBookingUseCase.execute(dto, user.userId);
    return BookingResponseDto.fromDomain(booking);
  }

  @Patch(':id/accept')
  async accept(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<BookingResponseDto> {
    const booking = await this.acceptBookingUseCase.execute(
      id,
      user.userId,
      user.role,
    );
    return BookingResponseDto.fromDomain(booking);
  }

  @Patch(':id/reject')
  async reject(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<BookingResponseDto> {
    const booking = await this.rejectBookingUseCase.execute(
      id,
      user.userId,
      user.role,
    );
    return BookingResponseDto.fromDomain(booking);
  }

  @Patch(':id/complete')
  async complete(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<BookingResponseDto> {
    const booking = await this.completeBookingUseCase.execute(
      id,
      user.userId,
      user.role,
    );
    return BookingResponseDto.fromDomain(booking);
  }

  @Patch(':id/cancel')
  async cancel(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<BookingResponseDto> {
    const booking = await this.cancelBookingUseCase.execute(
      id,
      user.userId,
      user.role,
    );
    return BookingResponseDto.fromDomain(booking);
  }
}
