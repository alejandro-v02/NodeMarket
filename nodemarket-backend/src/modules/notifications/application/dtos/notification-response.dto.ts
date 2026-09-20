import {
  Notification,
  NotificationType,
} from '../../domain/entities/notification.entity';

export class NotificationResponseDto {
  id!: string;
  userId!: string;
  type!: NotificationType;
  title!: string;
  message!: string;
  relatedId!: string | null;
  isRead!: boolean;
  createdAt!: Date;

  static fromDomain(notification: Notification): NotificationResponseDto {
    const dto = new NotificationResponseDto();
    dto.id = notification.id;
    dto.userId = notification.userId;
    dto.type = notification.type;
    dto.title = notification.title;
    dto.message = notification.message;
    dto.relatedId = notification.relatedId;
    dto.isRead = notification.isRead;
    dto.createdAt = notification.createdAt;
    return dto;
  }
}
