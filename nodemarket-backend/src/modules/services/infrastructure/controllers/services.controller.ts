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
} from '@nestjs/common';
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

  @Post()
  async create(@Body() dto: CreateServiceDto): Promise<ServiceResponseDto> {
    const service = await this.createServiceUseCase.execute(dto);
    return ServiceResponseDto.fromDomain(service);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateServiceDto,
  ): Promise<ServiceResponseDto> {
    const service = await this.updateServiceUseCase.execute(id, dto);
    return ServiceResponseDto.fromDomain(service);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deactivate(@Param('id') id: string): Promise<void> {
    await this.deactivateServiceUseCase.execute(id);
  }
}
