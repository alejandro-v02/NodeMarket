import { User } from '../../domain/entities/user.entity';
import { UserOrmEntity } from './user.orm-entity';

export class UserMapper {
  static toDomain(ormEntity: UserOrmEntity): User {
    return new User(
      ormEntity.id,
      ormEntity.name,
      ormEntity.email,
      ormEntity.passwordHash,
      ormEntity.role,
      ormEntity.createdAt,
      ormEntity.isActive,
    );
  }

  static toPersistence(domainUser: User): UserOrmEntity {
    const ormEntity = new UserOrmEntity();
    ormEntity.id = domainUser.id;
    ormEntity.name = domainUser.name;
    ormEntity.email = domainUser.email;
    ormEntity.passwordHash = domainUser.passwordHash;
    ormEntity.role = domainUser.role;
    ormEntity.createdAt = domainUser.createAt;
    ormEntity.isActive = domainUser.isActive;
    return ormEntity;
  }
}
