import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { BOOKING_REPOSITORY } from '../../../bookings/domain/repositories/booking.repository';
import type { BookingRepository } from '../../../bookings/domain/repositories/booking.repository';
import { Message } from '../../domain/entities/message.entity';
import { MESSAGE_REPOSITORY } from '../../domain/repositories/message.repository';
import type { MessageRepository } from '../../domain/repositories/message.repository';
import { SendMessageDto } from '../dtos/send-message.dto';

@Injectable()
export class SendMessageUseCase {
  constructor(
    @Inject(MESSAGE_REPOSITORY)
    private readonly messageRepository: MessageRepository,
    @Inject(BOOKING_REPOSITORY)
    private readonly bookingRepository: BookingRepository,
  ) {}

  async execute(dto: SendMessageDto, senderId: string): Promise<Message> {
    const booking = await this.bookingRepository.findById(dto.bookingId);
    if (!booking) {
      throw new BadRequestException(
        'bookingId must reference an existing booking',
      );
    }

    let recipientId: string;
    if (booking.clientId === senderId) {
      recipientId = booking.providerId;
    } else if (booking.providerId === senderId) {
      recipientId = booking.clientId;
    } else {
      throw new ForbiddenException('You can only message on your own bookings');
    }

    const message = new Message(
      randomUUID(),
      dto.bookingId,
      senderId,
      recipientId,
      dto.content,
      new Date(),
      null,
    );

    return this.messageRepository.save(message);
  }
}
