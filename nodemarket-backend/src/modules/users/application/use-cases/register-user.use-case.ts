import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { User, UserRole } from '../../domain/entities/user.entity';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository';
import type { UserRepository } from '../../domain/repositories/user.repository';
import { RegisterUserDto } from '../dtos/register-user.dto';

const SALT_ROUNDS = 10;

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(dto: RegisterUserDto): Promise<User> {
    // Defense in depth: self-registration must never create an admin, even
    // if the DTO's validation were ever loosened or bypassed.
    if (dto.role === UserRole.ADMIN) {
      throw new BadRequestException('Cannot self-register as admin');
    }

    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);

    const user = new User(
      randomUUID(),
      dto.name,
      dto.email,
      passwordHash,
      dto.role,
      new Date(),
    );

    return this.userRepository.save(user);
  }
}
