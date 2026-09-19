import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { LoginUserDto } from '../../application/dtos/login-user.dto';
import { RegisterUserDto } from '../../application/dtos/register-user.dto';
import { UserResponseDto } from '../../application/dtos/user-response.dto';
import {
  LoginResult,
  LoginUserUseCase,
} from '../../application/use-cases/login-user.use-case';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterUserDto): Promise<UserResponseDto> {
    const user = await this.registerUserUseCase.execute(dto);
    return UserResponseDto.fromDomain(user);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginUserDto): Promise<LoginResult> {
    return this.loginUserUseCase.execute(dto);
  }
}
