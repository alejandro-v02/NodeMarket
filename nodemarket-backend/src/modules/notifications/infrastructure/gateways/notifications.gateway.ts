import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SkipThrottle } from '@nestjs/throttler';
import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import type { JwtPayload } from '../../../users/infrastructure/strategies/jwt.strategy';
import { NotificationResponseDto } from '../../application/dtos/notification-response.dto';
import { Notification } from '../../domain/entities/notification.entity';
import { NotificationBroadcaster } from '../../domain/ports/notification-broadcaster';

function userRoom(userId: string): string {
  return `user:${userId}`;
}

@Injectable()
@SkipThrottle()
@WebSocketGateway({ namespace: '/notifications', cors: { origin: '*' } })
export class NotificationsGateway
  implements OnGatewayConnection, NotificationBroadcaster
{
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(NotificationsGateway.name);

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: Socket): Promise<void> {
    const token = client.handshake.auth?.token as string | undefined;
    if (!token) {
      client.disconnect(true);
      return;
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      await client.join(userRoom(payload.sub));
    } catch {
      client.disconnect(true);
    }
  }

  broadcast(notification: Notification): void {
    this.server
      .to(userRoom(notification.userId))
      .emit(
        'newNotification',
        NotificationResponseDto.fromDomain(notification),
      );
    this.logger.debug(
      `Notification ${notification.id} pushed to user ${notification.userId}`,
    );
  }
}
