import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginUserUseCase } from './application/use-cases/login-user.use-case';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import { USER_REPOSITORY } from './domain/repositories/user.repository';
import { AuthController } from './infrastructure/controllers/auth.controller';
import { TypeOrmUserRepository } from './infrastructure/persistence/typeorm-user.repository';
import { UserOrmEntity } from './infrastructure/persistence/user.orm-entity';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserOrmEntity]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    RegisterUserUseCase,
    LoginUserUseCase,
    JwtStrategy,
    {
      provide: USER_REPOSITORY,
      useClass: TypeOrmUserRepository,
    },
  ],
  exports: [USER_REPOSITORY],
})
export class UsersModule {}
