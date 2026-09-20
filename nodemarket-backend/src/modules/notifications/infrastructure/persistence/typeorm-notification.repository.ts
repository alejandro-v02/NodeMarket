import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../../domain/entities/notification.entity';
import { NotificationRepository } from '../../domain/repositories/notification.repository';
import { NotificationMapper } from './notification.mapper';
import { NotificationOrmEntity } from './notification.orm-entity';

@Injectable()
export class TypeOrmNotificationRepository implements NotificationRepository {
  constructor(
    @InjectRepository(NotificationOrmEntity)
    private readonly ormRepository: Repository<NotificationOrmEntity>,
  ) {}

  async save(notification: Notification): Promise<Notification> {
    const ormEntity = NotificationMapper.toPersistence(notification);
    const saved = await this.ormRepository.save(ormEntity);
    return NotificationMapper.toDomain(saved);
  }

  async findById(id: string): Promise<Notification | null> {
    const ormEntity = await this.ormRepository.findOneBy({ id });
    return ormEntity ? NotificationMapper.toDomain(ormEntity) : null;
  }

  async findByUserId(
    userId: string,
    onlyUnread: boolean,
  ): Promise<Notification[]> {
    const ormEntities = await this.ormRepository.find({
      where: onlyUnread ? { userId, isRead: false } : { userId },
      order: { createdAt: 'DESC' },
    });
    return ormEntities.map((ormEntity) =>
      NotificationMapper.toDomain(ormEntity),
    );
  }

  async update(notification: Notification): Promise<Notification> {
    return this.save(notification);
  }

  async markAllAsReadForUser(userId: string): Promise<void> {
    await this.ormRepository.update(
      { userId, isRead: false },
      { isRead: true },
    );
  }
}
