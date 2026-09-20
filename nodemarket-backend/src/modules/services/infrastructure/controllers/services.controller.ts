import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../../../../shared/infrastructure/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../../../shared/infrastructure/decorators/current-user.decorator';
import { Roles } from '../../../../shared/infrastructure/decorators/roles.decorator';
import { JwtAuthGuard } from '../../../../shared/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../shared/infrastructure/guards/roles.guard';
import { UserRole } from '../../../users/domain/entities/user.entity';
import { CreateServiceDto } from '../../application/dtos/create-service.dto';
import { ServiceResponseDto } from '../../application/dtos/service-response.dto';
import { UpdateServiceDto } from '../../application/dtos/update-service.dto';
import { CreateServiceUseCase } from '../../application/use-cases/create-service.use-case';
import { DeactivateServiceUseCase } from '../../application/use-cases/deactivate-service.use-case';
import { GetServiceUseCase } from '../../application/use-cases/get-service.use-case';
import { ListServicesUseCase } from '../../application/use-cases/list-services.use-case';
import { UpdateServiceUseCase } from '../../application/use-cases/update-service.use-case';

@Controller('services')
export class ServicesController {
  constructor(
    private readonly createServiceUseCase: CreateServiceUseCase,
    private readonly listServicesUseCase: ListServicesUseCase,
    private readonly getServiceUseCase: GetServiceUseCase,
    private readonly updateServiceUseCase: UpdateServiceUseCase,
    private readonly deactivateServiceUseCase: DeactivateServiceUseCase,
  ) {}

  @Get()
  async findAll(
    @Query('providerId') providerId?: string,
    @Query('categoryId') categoryId?: string,
  ): Promise<ServiceResponseDto[]> {
    const services = await this.listServicesUseCase.execute({
      providerId,
      categoryId,
    });
    return services.map((service) => ServiceResponseDto.fromDomain(service));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ServiceResponseDto> {
    const service = await this.getServiceUseCase.execute(id);
    return ServiceResponseDto.fromDomain(service);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROVIDER)
  @Post()
  async create(
    @Body() dto: CreateServiceDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ServiceResponseDto> {
    const service = await this.createServiceUseCase.execute(dto, user.userId);
    return ServiceResponseDto.fromDomain(service);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateServiceDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ServiceResponseDto> {
    const service = await this.updateServiceUseCase.execute(
      id,
      dto,
      user.userId,
      user.role,
    );
    return ServiceResponseDto.fromDomain(service);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deactivate(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<void> {
    await this.deactivateServiceUseCase.execute(id, user.userId, user.role);
  }
}
