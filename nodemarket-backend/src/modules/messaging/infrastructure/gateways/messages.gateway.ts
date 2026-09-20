import {
  HttpException,
  Logger,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserRole } from '../../../users/domain/entities/user.entity';
import type { JwtPayload } from '../../../users/infrastructure/strategies/jwt.strategy';
import { JoinBookingDto } from '../../application/dtos/join-booking.dto';
import { MarkMessageReadDto } from '../../application/dtos/mark-message-read.dto';
import { SendMessageDto } from '../../application/dtos/send-message.dto';
import { MessageResponseDto } from '../../application/dtos/message-response.dto';
import { ListMessagesUseCase } from '../../application/use-cases/list-messages.use-case';
import { MarkMessageReadUseCase } from '../../application/use-cases/mark-message-read.use-case';
import { SendMessageUseCase } from '../../application/use-cases/send-message.use-case';

interface SocketUser {
  userId: string;
  email: string;
  role: UserRole;
}

function bookingRoom(bookingId: string): string {
  return `booking:${bookingId}`;
}

function getSocketUser(client: Socket): SocketUser | undefined {
  return (client.data as { user?: SocketUser }).user;
}

function setSocketUser(client: Socket, user: SocketUser): void {
  (client.data as { user: SocketUser }).user = user;
}

function requireSocketUser(client: Socket): SocketUser {
  const user = getSocketUser(client);
  if (!user) {
    client.disconnect(true);
    throw new WsException('Unauthorized');
  }
  return user;
}

// NestJS's WS layer disconnects the client on any error that isn't a
// WsException, so use-case errors (Forbidden/NotFound/BadRequest/...) must be
// translated here instead of being allowed to bubble up as-is.
async function runWsHandler<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof WsException) {
      throw error;
    }
    if (error instanceof HttpException) {
      throw new WsException(error.getResponse());
    }
    throw new WsException('Something went wrong');
  }
}

@UsePipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
)
@WebSocketGateway({ namespace: '/messages', cors: { origin: '*' } })
export class MessagesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(MessagesGateway.name);

  constructor(
    private readonly sendMessageUseCase: SendMessageUseCase,
    private readonly markMessageReadUseCase: MarkMessageReadUseCase,
    private readonly listMessagesUseCase: ListMessagesUseCase,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket): Promise<void> {
    const token = client.handshake.auth?.token as string | undefined;
    if (!token) {
      client.disconnect(true);
      return;
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      const user: SocketUser = {
        userId: payload.sub,
        email: payload.email,
        role: payload.role,
      };
      setSocketUser(client, user);
    } catch {
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinBooking')
  handleJoinBooking(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: JoinBookingDto,
  ): Promise<MessageResponseDto[]> {
    return runWsHandler(async () => {
      const user = requireSocketUser(client);
      const messages = await this.listMessagesUseCase.execute(
        data.bookingId,
        user.userId,
        user.role,
      );
      await client.join(bookingRoom(data.bookingId));
      return messages.map((message) => MessageResponseDto.fromDomain(message));
    });
  }

  @SubscribeMessage('sendMessage')
  handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: SendMessageDto,
  ): Promise<MessageResponseDto> {
    return runWsHandler(async () => {
      const user = requireSocketUser(client);
      const message = await this.sendMessageUseCase.execute(dto, user.userId);
      const payload = MessageResponseDto.fromDomain(message);
      this.server.to(bookingRoom(dto.bookingId)).emit('newMessage', payload);
      return payload;
    });
  }

  @SubscribeMessage('markRead')
  handleMarkRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: MarkMessageReadDto,
  ): Promise<MessageResponseDto> {
    return runWsHandler(async () => {
      const user = requireSocketUser(client);
      const message = await this.markMessageReadUseCase.execute(
        data.messageId,
        user.userId,
      );
      const payload = MessageResponseDto.fromDomain(message);
      this.server
        .to(bookingRoom(message.bookingId))
        .emit('messageRead', payload);
      return payload;
    });
  }
}
