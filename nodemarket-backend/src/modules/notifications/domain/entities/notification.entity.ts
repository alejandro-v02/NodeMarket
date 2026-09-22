export enum NotificationType {
  BOOKING_ACCEPTED = 'booking_accepted',
  BOOKING_REJECTED = 'booking_rejected',
  BOOKING_COMPLETED = 'booking_completed',
  BOOKING_CANCELLED = 'booking_cancelled',
}

export class Notification {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly type: NotificationType,
    public readonly title: string,
    public readonly message: string,
    public readonly relatedId: string | null,
    public isRead: boolean,
    public readonly createdAt: Date,
  ) {}

  markAsRead(): void {
    this.isRead = true;
  }
}
