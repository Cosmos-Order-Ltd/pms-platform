import { PrismaClient } from '@prisma/client';

// Mock console methods to reduce test output noise
const originalConsole = { ...console };

beforeAll(() => {
  // Reduce console noise during tests
  console.log = jest.fn();
  console.info = jest.fn();
  console.warn = jest.fn();
  // Keep error logging for debugging
  console.error = originalConsole.error;
});

afterAll(() => {
  // Restore console methods
  Object.assign(console, originalConsole);
});

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'file:./test.db';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing';
process.env.REDIS_URL = 'redis://localhost:6379/1';

// Global test timeout
jest.setTimeout(15000);

// Mock timers for tests that use setTimeout/setInterval
beforeEach(() => {
  jest.clearAllTimers();
  jest.clearAllMocks();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});