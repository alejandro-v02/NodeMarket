export class Message {
  constructor(
    public readonly id: string,
    public readonly bookingId: string,
    public readonly senderId: string,
    public readonly recipientId: string,
    public readonly content: string,
    public readonly sentAt: Date,
    public readAt: Date | null,
  ) {}

  markAsRead(): void {
    if (!this.readAt) {
      this.readAt = new Date();
    }
  }
}
