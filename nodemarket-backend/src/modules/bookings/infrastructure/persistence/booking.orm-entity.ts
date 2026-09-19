import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';
import { BookingStatus } from '../../domain/entities/booking.entity';

@Entity('bookings')
export class BookingOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'client_id', type: 'uuid' })
  clientId: string;

  @Column({ name: 'provider_id', type: 'uuid' })
  providerId: string;

  @Column({ name: 'service_id', type: 'uuid' })
  serviceId: string;

  @Column({ name: 'scheduled_at', type: 'timestamptz' })
  scheduledAt: Date;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.PENDING })
  status: BookingStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
