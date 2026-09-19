import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository';
import type { UserRepository } from '../../domain/repositories/user.repository';
import { LoginUserDto } from '../dtos/login-user.dto';

export interface LoginResult {
  accessToken: string;
}

@Injectable()
export class LoginUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(dto: LoginUserDto): Promise<LoginResult> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return { accessToken };
  }
}
