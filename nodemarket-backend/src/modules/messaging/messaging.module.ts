import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsModule } from '../bookings/bookings.module';
import { UsersModule } from '../users/users.module';
import { ListMessagesUseCase } from './application/use-cases/list-messages.use-case';
import { MarkMessageReadUseCase } from './application/use-cases/mark-message-read.use-case';
import { SendMessageUseCase } from './application/use-cases/send-message.use-case';
import { MESSAGE_REPOSITORY } from './domain/repositories/message.repository';
import { MessagesController } from './infrastructure/controllers/messages.controller';
import { MessagesGateway } from './infrastructure/gateways/messages.gateway';
import { MessageOrmEntity } from './infrastructure/persistence/message.orm-entity';
import { TypeOrmMessageRepository } from './infrastructure/persistence/typeorm-message.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([MessageOrmEntity]),
    UsersModule,
    BookingsModule,
  ],
  controllers: [MessagesController],
  providers: [
    SendMessageUseCase,
    ListMessagesUseCase,
    MarkMessageReadUseCase,
    MessagesGateway,
    {
      provide: MESSAGE_REPOSITORY,
      useClass: TypeOrmMessageRepository,
    },
  ],
})
export class MessagingModule {}
