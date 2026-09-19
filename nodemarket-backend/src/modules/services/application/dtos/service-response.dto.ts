import { Service } from '../../domain/entities/service.entity';

export class ServiceResponseDto {
  id!: string;
  providerId!: string;
  categoryId!: string;
  title!: string;
  description!: string;
  price!: number;
  isActive!: boolean;
  createdAt!: Date;

  static fromDomain(service: Service): ServiceResponseDto {
    const dto = new ServiceResponseDto();
    dto.id = service.id;
    dto.providerId = service.providerId;
    dto.categoryId = service.categoryId;
    dto.title = service.title;
    dto.description = service.description;
    dto.price = service.price;
    dto.isActive = service.isActive;
    dto.createdAt = service.createdAt;
    return dto;
  }
}
