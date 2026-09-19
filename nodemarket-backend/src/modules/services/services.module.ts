import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from '../categories/categories.module';
import { UsersModule } from '../users/users.module';
import { CreateServiceUseCase } from './application/use-cases/create-service.use-case';
import { DeactivateServiceUseCase } from './application/use-cases/deactivate-service.use-case';
import { GetServiceUseCase } from './application/use-cases/get-service.use-case';
import { ListServicesUseCase } from './application/use-cases/list-services.use-case';
import { UpdateServiceUseCase } from './application/use-cases/update-service.use-case';
import { SERVICE_REPOSITORY } from './domain/repositories/service.repository';
import { ServicesController } from './infrastructure/controllers/services.controller';
import { ServiceOrmEntity } from './infrastructure/persistence/service.orm-entity';
import { TypeOrmServiceRepository } from './infrastructure/persistence/typeorm-service.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServiceOrmEntity]),
    UsersModule,
    CategoriesModule,
  ],
  controllers: [ServicesController],
  providers: [
    CreateServiceUseCase,
    ListServicesUseCase,
    GetServiceUseCase,
    UpdateServiceUseCase,
    DeactivateServiceUseCase,
    {
      provide: SERVICE_REPOSITORY,
      useClass: TypeOrmServiceRepository,
    },
  ],
  exports: [SERVICE_REPOSITORY],
})
export class ServicesModule {}
