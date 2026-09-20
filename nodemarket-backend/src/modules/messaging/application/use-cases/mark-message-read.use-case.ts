import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Message } from '../../domain/entities/message.entity';
import { MESSAGE_REPOSITORY } from '../../domain/repositories/message.repository';
import type { MessageRepository } from '../../domain/repositories/message.repository';

@Injectable()
export class MarkMessageReadUseCase {
  constructor(
    @Inject(MESSAGE_REPOSITORY)
    private readonly messageRepository: MessageRepository,
  ) {}

  async execute(id: string, requesterId: string): Promise<Message> {
    const message = await this.messageRepository.findById(id);
    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.recipientId !== requesterId) {
      throw new ForbiddenException(
        'Only the recipient can mark a message as read',
      );
    }

    message.markAsRead();
    return this.messageRepository.update(message);
  }
}
