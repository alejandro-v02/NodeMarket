import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { AppModule } from '../src/app.module';
import { User, UserRole } from '../src/modules/users/domain/entities/user.entity';
import { USER_REPOSITORY } from '../src/modules/users/domain/repositories/user.repository';
import type { UserRepository } from '../src/modules/users/domain/repositories/user.repository';

const SALT_ROUNDS = 10;

async function main(): Promise<void> {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  const name = process.env.SEED_ADMIN_NAME ?? 'Admin';

  if (!email || !password) {
    console.error(
      'Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD (and optionally SEED_ADMIN_NAME) before running this script.',
    );
    process.exit(1);
  }
  if (password.length < 8) {
    console.error('SEED_ADMIN_PASSWORD must be at least 8 characters.');
    process.exit(1);
  }

  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: false,
  });

  try {
    const userRepository = app.get<UserRepository>(USER_REPOSITORY);

    const existing = await userRepository.findByEmail(email);
    if (existing) {
      console.error(`A user with email ${email} already exists (role: ${existing.role}).`);
      process.exit(1);
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const admin = new User(randomUUID(), name, email, passwordHash, UserRole.ADMIN, new Date());
    await userRepository.save(admin);

    console.log(`Admin user created: ${email}`);
  } finally {
    await app.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
