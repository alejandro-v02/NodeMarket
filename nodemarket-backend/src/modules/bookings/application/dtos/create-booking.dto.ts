import {
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateBookingDto {
  @IsUUID()
  clientId!: string;

  @IsUUID()
  serviceId!: string;

  @IsDateString()
  scheduledAt!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
