import {
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../../../../shared/infrastructure/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../../../shared/infrastructure/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../../../shared/infrastructure/guards/jwt-auth.guard';
import { MessageResponseDto } from '../../application/dtos/message-response.dto';
import { ListMessagesUseCase } from '../../application/use-cases/list-messages.use-case';
import { MarkMessageReadUseCase } from '../../application/use-cases/mark-message-read.use-case';

@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessagesController {
  constructor(
    private readonly listMessagesUseCase: ListMessagesUseCase,
    private readonly markMessageReadUseCase: MarkMessageReadUseCase,
  ) {}

  @Get()
  async findByBooking(
    @Query('bookingId') bookingId: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<MessageResponseDto[]> {
    const messages = await this.listMessagesUseCase.execute(
      bookingId,
      user.userId,
      user.role,
    );
    return messages.map((message) => MessageResponseDto.fromDomain(message));
  }

  @Patch(':id/read')
  async markRead(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<MessageResponseDto> {
    const message = await this.markMessageReadUseCase.execute(id, user.userId);
    return MessageResponseDto.fromDomain(message);
  }
}
