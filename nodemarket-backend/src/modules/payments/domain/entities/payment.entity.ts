export enum PaymentMethod {
  CASH = 'cash',
  CARD = 'card',
  TRANSFER = 'transfer',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export class Payment {
  constructor(
    public readonly id: string,
    public readonly bookingId: string,
    public readonly clientId: string,
    public readonly providerId: string,
    public readonly amount: number,
    public readonly method: PaymentMethod,
    public status: PaymentStatus,
    public readonly createdAt: Date,
    public paidAt: Date | null,
  ) {}

  markAsPaid(): void {
    this.ensureStatus(PaymentStatus.PENDING, 'mark as paid');
    this.status = PaymentStatus.PAID;
    this.paidAt = new Date();
  }

  markAsFailed(): void {
    this.ensureStatus(PaymentStatus.PENDING, 'mark as failed');
    this.status = PaymentStatus.FAILED;
  }

  refund(): void {
    this.ensureStatus(PaymentStatus.PAID, 'refund');
    this.status = PaymentStatus.REFUNDED;
  }

  private ensureStatus(expected: PaymentStatus, action: string): void {
    if (this.status !== expected) {
      throw new Error(
        `Cannot ${action} a payment with status "${this.status}"`,
      );
    }
  }
}
