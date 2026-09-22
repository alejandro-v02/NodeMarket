import { Notification } from '../../domain/entities/notification.entity';
import { NotificationOrmEntity } from './notification.orm-entity';

export class NotificationMapper {
  static toDomain(ormEntity: NotificationOrmEntity): Notification {
    return new Notification(
      ormEntity.id,
      ormEntity.userId,
      ormEntity.type,
      ormEntity.title,
      ormEntity.message,
      ormEntity.relatedId,
      ormEntity.isRead,
      ormEntity.createdAt,
    );
  }

  static toPersistence(
    domainNotification: Notification,
  ): NotificationOrmEntity {
    const ormEntity = new NotificationOrmEntity();
    ormEntity.id = domainNotification.id;
    ormEntity.userId = domainNotification.userId;
    ormEntity.type = domainNotification.type;
    ormEntity.title = domainNotification.title;
    ormEntity.message = domainNotification.message;
    ormEntity.relatedId = domainNotification.relatedId;
    ormEntity.isRead = domainNotification.isRead;
    ormEntity.createdAt = domainNotification.createdAt;
    return ormEntity;
  }
}
