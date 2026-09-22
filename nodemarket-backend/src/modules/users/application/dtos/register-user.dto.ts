import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from '../../domain/entities/user.entity';

// Self-registration may only create CLIENT or PROVIDER accounts. ADMIN is
// deliberately excluded here so nobody can grant themselves admin
// privileges through this public endpoint; admins must be created directly
// in the database until a dedicated admin-management flow exists.
const SELF_REGISTERABLE_ROLES = [UserRole.CLIENT, UserRole.PROVIDER] as const;

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsIn(SELF_REGISTERABLE_ROLES)
  role!: UserRole;
}
