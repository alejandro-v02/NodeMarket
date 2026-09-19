export class Review {
  constructor(
    public readonly id: string,
    public readonly bookingId: string,
    public readonly clientId: string,
    public readonly providerId: string,
    public rating: number,
    public comment: string | null,
    public readonly createdAt: Date,
  ) {}

  update(rating: number, comment: string | null): void {
    this.rating = rating;
    this.comment = comment;
  }
}
