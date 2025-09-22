import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export default async function globalTeardown() {
  try {
    console.log('🧹 Cleaning up test database...');

    // Close database connections
    await prisma.$disconnect();

    // Remove test database file
    const testDbPath = path.join(__dirname, '../../test.db');
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }

    // Remove test database journal files
    const journalPath = `${testDbPath}-journal`;
    if (fs.existsSync(journalPath)) {
      fs.unlinkSync(journalPath);
    }

    console.log('✅ Test cleanup complete');
  } catch (error) {
    console.error('❌ Test cleanup failed:', error);
  }
}