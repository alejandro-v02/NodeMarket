export enum UserRole {
  CLIENT = 'client',
  PROVIDER = 'provider',
  ADMIN = 'admin',
}
export class User {
  constructor(
    public readonly id: string,
    public name: string,
    public email: string,
    public passwordHash: string,
    public role: UserRole,
    public readonly createAt: Date,
    public isActive: boolean = true,
  ) {}

  //Metodos de negocio propios del dominio
  deactivate(): void {
    this.isActive = false;
  }
  isProvider(): boolean {
    return this.role === UserRole.PROVIDER;
  }
  isClient(): boolean {
    return this.role === UserRole.CLIENT;
  }
}
