import { Notification } from '../entities/notification.entity';

export interface NotificationRepository {
  save(notification: Notification): Promise<Notification>;
  findById(id: string): Promise<Notification | null>;
  findByUserId(userId: string, onlyUnread: boolean): Promise<Notification[]>;
  update(notification: Notification): Promise<Notification>;
  markAllAsReadForUser(userId: string): Promise<void>;
}

export const NOTIFICATION_REPOSITORY = 'NOTIFICATION_REPOSITORY';
