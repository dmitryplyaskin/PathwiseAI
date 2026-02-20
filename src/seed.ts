import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './modules/users/services/users.service';
import { UserRole } from './modules/users/enums/user-role.enum';

async function seed(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  try {
    const createDefaultUser = process.env.CREATE_DEFAULT_USER === 'true';

    if (!createDefaultUser) {
      // eslint-disable-next-line no-console
      console.log('Seed skipped: set CREATE_DEFAULT_USER=true to enable default seeding.');
      return;
    }

    const usersService = app.get(UsersService);

    const username = process.env.SEED_USERNAME || 'admin';
    const email = process.env.SEED_EMAIL || 'admin@example.com';
    const password = process.env.SEED_PASSWORD || 'admin12345';
    const role =
      process.env.SEED_ROLE === UserRole.ADMIN ? UserRole.ADMIN : UserRole.USER;

    try {
      await usersService.create({
        username,
        email,
        password,
        role,
        settings: {},
      });
      // eslint-disable-next-line no-console
      console.log(`Seed user created: ${email}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      // eslint-disable-next-line no-console
      console.log(`Seed user was not created: ${message}`);
    }
  } finally {
    await app.close();
  }
}

seed().catch((error: unknown) => {
  const errorObj = error instanceof Error ? error : new Error(String(error));
  // eslint-disable-next-line no-console
  console.error('Seed failed:', errorObj.message);
  process.exit(1);
});