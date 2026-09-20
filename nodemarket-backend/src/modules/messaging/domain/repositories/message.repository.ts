import { Message } from '../entities/message.entity';

export interface MessageRepository {
  save(message: Message): Promise<Message>;
  findById(id: string): Promise<Message | null>;
  findByBookingId(bookingId: string): Promise<Message[]>;
  update(message: Message): Promise<Message>;
}

export const MESSAGE_REPOSITORY = 'MESSAGE_REPOSITORY';
