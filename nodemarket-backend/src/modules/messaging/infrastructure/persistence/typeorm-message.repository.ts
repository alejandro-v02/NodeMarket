import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../../domain/entities/message.entity';
import { MessageRepository } from '../../domain/repositories/message.repository';
import { MessageMapper } from './message.mapper';
import { MessageOrmEntity } from './message.orm-entity';

@Injectable()
export class TypeOrmMessageRepository implements MessageRepository {
  constructor(
    @InjectRepository(MessageOrmEntity)
    private readonly ormRepository: Repository<MessageOrmEntity>,
  ) {}

  async save(message: Message): Promise<Message> {
    const ormEntity = MessageMapper.toPersistence(message);
    const saved = await this.ormRepository.save(ormEntity);
    return MessageMapper.toDomain(saved);
  }

  async findById(id: string): Promise<Message | null> {
    const ormEntity = await this.ormRepository.findOneBy({ id });
    return ormEntity ? MessageMapper.toDomain(ormEntity) : null;
  }

  async findByBookingId(bookingId: string): Promise<Message[]> {
    const ormEntities = await this.ormRepository.find({
      where: { bookingId },
      order: { sentAt: 'ASC' },
    });
    return ormEntities.map((ormEntity) => MessageMapper.toDomain(ormEntity));
  }

  async update(message: Message): Promise<Message> {
    return this.save(message);
  }
}
