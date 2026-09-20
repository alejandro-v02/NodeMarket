import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  Notification,
  NotificationType,
} from '../../domain/entities/notification.entity';
import { NOTIFICATION_BROADCASTER } from '../../domain/ports/notification-broadcaster';
import type { NotificationBroadcaster } from '../../domain/ports/notification-broadcaster';
import { NOTIFICATION_REPOSITORY } from '../../domain/repositories/notification.repository';
import type { NotificationRepository } from '../../domain/repositories/notification.repository';

export interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedId?: string;
}

@Injectable()
export class CreateNotificationUseCase {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notificationRepository: NotificationRepository,
    @Inject(NOTIFICATION_BROADCASTER)
    private readonly broadcaster: NotificationBroadcaster,
  ) {}

  async execute(params: CreateNotificationParams): Promise<Notification> {
    const notification = new Notification(
      randomUUID(),
      params.userId,
      params.type,
      params.title,
      params.message,
      params.relatedId ?? null,
      false,
      new Date(),
    );

    const saved = await this.notificationRepository.save(notification);
    this.broadcaster.broadcast(saved);
    return saved;
  }
}
