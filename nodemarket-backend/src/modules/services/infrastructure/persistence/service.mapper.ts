import { Service } from '../../domain/entities/service.entity';
import { ServiceOrmEntity } from './service.orm-entity';

export class ServiceMapper {
  static toDomain(ormEntity: ServiceOrmEntity): Service {
    return new Service(
      ormEntity.id,
      ormEntity.providerId,
      ormEntity.categoryId,
      ormEntity.title,
      ormEntity.description,
      ormEntity.price,
      ormEntity.createdAt,
      ormEntity.isActive,
    );
  }

  static toPersistence(domainService: Service): ServiceOrmEntity {
    const ormEntity = new ServiceOrmEntity();
    ormEntity.id = domainService.id;
    ormEntity.providerId = domainService.providerId;
    ormEntity.categoryId = domainService.categoryId;
    ormEntity.title = domainService.title;
    ormEntity.description = domainService.description;
    ormEntity.price = domainService.price;
    ormEntity.createdAt = domainService.createdAt;
    ormEntity.isActive = domainService.isActive;
    return ormEntity;
  }
}
