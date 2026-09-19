export class Category {
  constructor(
    public readonly id: string,
    public name: string,
    public description: string | null,
    public readonly createdAt: Date,
    public isActive: boolean = true,
  ) {}

  deactivate(): void {
    this.isActive = false;
  }

  activate(): void {
    this.isActive = true;
  }

  rename(name: string): void {
    this.name = name;
  }
}
