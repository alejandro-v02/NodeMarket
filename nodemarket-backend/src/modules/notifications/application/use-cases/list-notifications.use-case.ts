import { Inject, Injectable } from '@nestjs/common';
import { Notification } from '../../domain/entities/notification.entity';
import { NOTIFICATION_REPOSITORY } from '../../domain/repositories/notification.repository';
import type { NotificationRepository } from '../../domain/repositories/notification.repository';

@Injectable()
export class ListNotificationsUseCase {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute(userId: string, onlyUnread: boolean): Promise<Notification[]> {
    return this.notificationRepository.findByUserId(userId, onlyUnread);
  }
}
