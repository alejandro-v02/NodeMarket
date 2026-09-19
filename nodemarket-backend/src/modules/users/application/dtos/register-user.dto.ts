import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from '../../domain/entities/user.entity';

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsEnum(UserRole)
  role: UserRole;
}
