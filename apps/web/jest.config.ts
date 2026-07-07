import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@motohub/ui$': '<rootDir>/../../packages/ui/src/index.ts',
    '^@motohub/config$': '<rootDir>/../../packages/config/src/index.ts',
    '^@motohub/types$': '<rootDir>/../../packages/types/src/index.ts',
    '^@motohub/utils$': '<rootDir>/../../packages/utils/src/index.ts',
  },
};

export default createJestConfig(config);
