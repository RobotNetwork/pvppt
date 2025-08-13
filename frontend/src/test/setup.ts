import { beforeAll, afterEach, afterAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Global test setup if needed
beforeAll(() => {
  // Set up any global test configuration
});

// Global test cleanup if needed
afterAll(() => {
  // Clean up any global test resources
});
