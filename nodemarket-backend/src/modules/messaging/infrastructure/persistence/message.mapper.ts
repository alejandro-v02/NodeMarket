import { Message } from '../../domain/entities/message.entity';
import { MessageOrmEntity } from './message.orm-entity';

export class MessageMapper {
  static toDomain(ormEntity: MessageOrmEntity): Message {
    return new Message(
      ormEntity.id,
      ormEntity.bookingId,
      ormEntity.senderId,
      ormEntity.recipientId,
      ormEntity.content,
      ormEntity.sentAt,
      ormEntity.readAt,
    );
  }

  static toPersistence(domainMessage: Message): MessageOrmEntity {
    const ormEntity = new MessageOrmEntity();
    ormEntity.id = domainMessage.id;
    ormEntity.bookingId = domainMessage.bookingId;
    ormEntity.senderId = domainMessage.senderId;
    ormEntity.recipientId = domainMessage.recipientId;
    ormEntity.content = domainMessage.content;
    ormEntity.sentAt = domainMessage.sentAt;
    ormEntity.readAt = domainMessage.readAt;
    return ormEntity;
  }
}
