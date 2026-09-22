import { IsUUID } from 'class-validator';

export class JoinBookingDto {
  @IsUUID()
  bookingId!: string;
}
