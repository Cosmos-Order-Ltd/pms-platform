import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import path from 'path';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'file:./test.db',
    },
  },
});

export default async function globalSetup() {
  try {
    console.log('🔧 Setting up test database...');

    // Reset the test database
    try {
      await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS User');
      await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS Property');
      await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS Booking');
      await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS _prisma_migrations');
    } catch (error) {
      // Database might not exist yet, that's okay
    }

    // Run migrations
    const schemaPath = path.join(__dirname, '../../prisma/schema.prisma');
    execSync(`npx prisma db push --schema=${schemaPath}`, {
      env: { ...process.env, DATABASE_URL: 'file:./test.db' },
      stdio: 'inherit',
    });

    console.log('✅ Test database setup complete');
  } catch (error) {
    console.error('❌ Test database setup failed:', error);
    throw error;
  }
}