import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { CreateNotificationUseCase } from './application/use-cases/create-notification.use-case';
import { ListNotificationsUseCase } from './application/use-cases/list-notifications.use-case';
import { MarkAllNotificationsReadUseCase } from './application/use-cases/mark-all-notifications-read.use-case';
import { MarkNotificationReadUseCase } from './application/use-cases/mark-notification-read.use-case';
import { NOTIFICATION_BROADCASTER } from './domain/ports/notification-broadcaster';
import { NOTIFICATION_REPOSITORY } from './domain/repositories/notification.repository';
import { NotificationsController } from './infrastructure/controllers/notifications.controller';
import { NotificationsGateway } from './infrastructure/gateways/notifications.gateway';
import { NotificationOrmEntity } from './infrastructure/persistence/notification.orm-entity';
import { TypeOrmNotificationRepository } from './infrastructure/persistence/typeorm-notification.repository';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationOrmEntity]), UsersModule],
  controllers: [NotificationsController],
  providers: [
    CreateNotificationUseCase,
    ListNotificationsUseCase,
    MarkNotificationReadUseCase,
    MarkAllNotificationsReadUseCase,
    NotificationsGateway,
    {
      provide: NOTIFICATION_REPOSITORY,
      useClass: TypeOrmNotificationRepository,
    },
    {
      provide: NOTIFICATION_BROADCASTER,
      useExisting: NotificationsGateway,
    },
  ],
  exports: [CreateNotificationUseCase],
})
export class NotificationsModule {}
