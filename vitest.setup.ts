import { vi } from 'vitest';

// Mock Sentry to avoid actual error reporting during tests
vi.mock('@sentry/nextjs', () => ({
  captureException: vi.fn(),
  captureMessage: vi.fn(),
}));
