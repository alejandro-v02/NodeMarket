export enum BookingStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export class Booking {
  constructor(
    public readonly id: string,
    public readonly clientId: string,
    public readonly providerId: string,
    public readonly serviceId: string,
    public scheduledAt: Date,
    public notes: string | null,
    public status: BookingStatus,
    public readonly createdAt: Date,
  ) {}

  accept(): void {
    this.ensureStatus(BookingStatus.PENDING, 'accept');
    this.status = BookingStatus.ACCEPTED;
  }

  reject(): void {
    this.ensureStatus(BookingStatus.PENDING, 'reject');
    this.status = BookingStatus.REJECTED;
  }

  complete(): void {
    this.ensureStatus(BookingStatus.ACCEPTED, 'complete');
    this.status = BookingStatus.COMPLETED;
  }

  cancel(): void {
    if (
      this.status !== BookingStatus.PENDING &&
      this.status !== BookingStatus.ACCEPTED
    ) {
      throw new Error(`Cannot cancel a booking with status "${this.status}"`);
    }
    this.status = BookingStatus.CANCELLED;
  }

  private ensureStatus(expected: BookingStatus, action: string): void {
    if (this.status !== expected) {
      throw new Error(
        `Cannot ${action} a booking with status "${this.status}"`,
      );
    }
  }
}
