import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { BookingResponseDto } from '../../application/dtos/booking-response.dto';
import { CreateBookingDto } from '../../application/dtos/create-booking.dto';
import { AcceptBookingUseCase } from '../../application/use-cases/accept-booking.use-case';
import { CancelBookingUseCase } from '../../application/use-cases/cancel-booking.use-case';
import { CompleteBookingUseCase } from '../../application/use-cases/complete-booking.use-case';
import { CreateBookingUseCase } from '../../application/use-cases/create-booking.use-case';
import { GetBookingUseCase } from '../../application/use-cases/get-booking.use-case';
import { ListBookingsUseCase } from '../../application/use-cases/list-bookings.use-case';
import { RejectBookingUseCase } from '../../application/use-cases/reject-booking.use-case';

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
    @Query('clientId') clientId?: string,
    @Query('providerId') providerId?: string,
  ): Promise<BookingResponseDto[]> {
    const bookings = await this.listBookingsUseCase.execute({
      clientId,
      providerId,
    });
    return bookings.map((booking) => BookingResponseDto.fromDomain(booking));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<BookingResponseDto> {
    const booking = await this.getBookingUseCase.execute(id);
    return BookingResponseDto.fromDomain(booking);
  }

  @Post()
  async create(@Body() dto: CreateBookingDto): Promise<BookingResponseDto> {
    const booking = await this.createBookingUseCase.execute(dto);
    return BookingResponseDto.fromDomain(booking);
  }

  @Patch(':id/accept')
  async accept(@Param('id') id: string): Promise<BookingResponseDto> {
    const booking = await this.acceptBookingUseCase.execute(id);
    return BookingResponseDto.fromDomain(booking);
  }

  @Patch(':id/reject')
  async reject(@Param('id') id: string): Promise<BookingResponseDto> {
    const booking = await this.rejectBookingUseCase.execute(id);
    return BookingResponseDto.fromDomain(booking);
  }

  @Patch(':id/complete')
  async complete(@Param('id') id: string): Promise<BookingResponseDto> {
    const booking = await this.completeBookingUseCase.execute(id);
    return BookingResponseDto.fromDomain(booking);
  }

  @Patch(':id/cancel')
  async cancel(@Param('id') id: string): Promise<BookingResponseDto> {
    const booking = await this.cancelBookingUseCase.execute(id);
    return BookingResponseDto.fromDomain(booking);
  }
}
