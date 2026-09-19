import { User, UserRole } from '../../domain/entities/user.entity';

export class UserResponseDto {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  isActive: boolean;

  static fromDomain(user: User): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = user.id;
    dto.name = user.name;
    dto.email = user.email;
    dto.role = user.role;
    dto.createdAt = user.createAt;
    dto.isActive = user.isActive;
    return dto;
  }
}
