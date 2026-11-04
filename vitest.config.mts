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
    include: ['src/**/*.test.ts', 'scripts/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: [
        'src/**/*.{ts,tsx}',
        'scripts/perf/lib.ts',
        'scripts/visual/{lib,markdown}.ts',
      ],
      exclude: ['**/*.d.ts', '**/index.ts', '**/*.test.ts', '**/types/**'],
      reporter: ['text', 'html', 'json-summary'],
      thresholds: {
        // Global ratchet: measured overall values rounded down. Raise only.
        lines: 20,
        statements: 19,
        functions: 16,
        branches: 15,
        // Logic layers. DOM-dependent files are left out of the glob (they
        // stay in the report) and are guarded by e2e scenarios instead:
        //  - features/post/lib/scrollToHeading.ts: e2e 5 (TOC heading scroll)
        //  - shared/utils/elementUtils.ts (HTMLElement instanceof): e2e 5
        //  - shared/utils/themeTransition.ts (View Transition API): e2e 11
        //  - shared/utils/storage.ts (localStorage): e2e 11 (dark mode)
        // refUtils.ts is pure logic and is unit-tested, so it is included.
        'src/{features/*/lib,shared/utils}/!(scrollToHeading|elementUtils|themeTransition|storage).ts':
          {
            lines: 80,
            statements: 80,
            functions: 80,
            branches: 80,
          },
        // perf 하네스의 순수 로직. fs/빌드를 다루는 measure.ts, cli.ts 는 `pnpm perf:check` 가 검증한다.
        'scripts/perf/lib.ts': {
          lines: 80,
          statements: 80,
          functions: 80,
          branches: 80,
        },
        // visual 하네스의 순수 로직(판정, diff, 마크다운). 브라우저/빌드/git 을 다루는
        // compare.ts, publish.ts 는 `pnpm visual:compare` 실행으로 검증한다.
        'scripts/visual/{lib,markdown}.ts': {
          lines: 80,
          statements: 80,
          functions: 80,
          branches: 80,
        },
      },
    },
  },
});
