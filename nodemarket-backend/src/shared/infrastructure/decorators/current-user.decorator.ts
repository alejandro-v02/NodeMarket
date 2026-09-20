import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserRole } from '../../../modules/users/domain/entities/user.entity';

export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: UserRole;
}

interface AuthenticatedRequest {
  user: AuthenticatedUser;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    return request.user;
  },
);
