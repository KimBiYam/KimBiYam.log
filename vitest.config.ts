import { resolve } from 'path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: [
      '**/__tests__/**/*.(js|jsx|ts|tsx)',
      '**/*.(test|spec).(js|jsx|ts|tsx)',
    ],
    exclude: [
      '**/node_modules/**',
      '**/.next/**',
      '**/.claude/**',
      '**/coverage/**',
    ],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.(js|jsx|ts|tsx)'],
      exclude: [
        'src/**/*.d.ts',
        'src/**/*.stories.(js|jsx|ts|tsx)',
        'src/app/**/*', // Exclude Next.js app router files
        'src/**/index.(js|jsx|ts|tsx)', // Exclude index files that just export
      ],
    },
  },
  resolve: {
    alias: {
      '@src': resolve(__dirname, './src'),
    },
  },
});
