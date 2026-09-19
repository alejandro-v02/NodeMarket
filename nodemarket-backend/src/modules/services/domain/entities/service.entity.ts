export class Service {
  constructor(
    public readonly id: string,
    public readonly providerId: string,
    public categoryId: string,
    public title: string,
    public description: string,
    public price: number,
    public readonly createdAt: Date,
    public isActive: boolean = true,
  ) {}

  deactivate(): void {
    this.isActive = false;
  }

  activate(): void {
    this.isActive = true;
  }

  updateDetails(title: string, description: string, price: number): void {
    this.title = title;
    this.description = description;
    this.price = price;
  }

  changeCategory(categoryId: string): void {
    this.categoryId = categoryId;
  }
}
