const baseConfig = require('../jest.config.base.js');

module.exports = {
  ...baseConfig,
  displayName: 'PMS Backend',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
  globalSetup: '<rootDir>/src/__tests__/globalSetup.ts',
  globalTeardown: '<rootDir>/src/__tests__/globalTeardown.ts',
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{ts,js}',
    '<rootDir>/src/**/?(*.)(spec|test).{ts,js}',
  ],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@tests/(.*)$': '<rootDir>/src/__tests__/$1',
    '^@models/(.*)$': '<rootDir>/src/models/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@middleware/(.*)$': '<rootDir>/src/middleware/$1',
  },
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/coverage/',
    '/src/__tests__/',
    '/src/types/',
    '/prisma/',
  ],
  testTimeout: 15000,
};