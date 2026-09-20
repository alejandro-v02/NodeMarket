import { Message } from '../../domain/entities/message.entity';

export class MessageResponseDto {
  id!: string;
  bookingId!: string;
  senderId!: string;
  recipientId!: string;
  content!: string;
  sentAt!: Date;
  readAt!: Date | null;

  static fromDomain(message: Message): MessageResponseDto {
    const dto = new MessageResponseDto();
    dto.id = message.id;
    dto.bookingId = message.bookingId;
    dto.senderId = message.senderId;
    dto.recipientId = message.recipientId;
    dto.content = message.content;
    dto.sentAt = message.sentAt;
    dto.readAt = message.readAt;
    return dto;
  }
}
