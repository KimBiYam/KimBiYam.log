import path from 'node:path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@src': path.resolve(import.meta.dirname, 'src'),
      'server-only': path.resolve(
        import.meta.dirname,
        'vitest.stubs/server-only.ts',
      ),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['**/*.d.ts', '**/index.ts', '**/*.test.ts', '**/types/**'],
      reporter: ['text', 'html', 'json-summary'],
    },
  },
});
