import { Notification } from '../entities/notification.entity';

export interface NotificationBroadcaster {
  broadcast(notification: Notification): void;
}

export const NOTIFICATION_BROADCASTER = 'NOTIFICATION_BROADCASTER';
