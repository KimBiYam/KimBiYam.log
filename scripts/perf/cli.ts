import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import {
  SCHEMA_VERSION,
  compareMetrics,
  formatDiffTable,
  isPerfBaseline,
  ratchetBaseline,
} from './lib.ts';
import { measure } from './measure.ts';

import type { PerfBaseline } from './lib.ts';

const BASELINE_PATH = path.resolve(
  import.meta.dirname,
  '../../perf-baseline.json',
);

const [command = 'measure', ...flags] = process.argv.slice(2);
const reuse = flags.includes('--reuse');
const force = flags.includes('--force');

const readBaseline = (): PerfBaseline | null => {
  if (!existsSync(BASELINE_PATH)) return null;
  const parsed: unknown = JSON.parse(readFileSync(BASELINE_PATH, 'utf8'));
  if (!isPerfBaseline(parsed)) {
    throw new Error(`${BASELINE_PATH} is not a valid perf baseline`);
  }
  return parsed;
};

const writeBaseline = (sizes: PerfBaseline['firstLoadJsGzipBytes']) => {
  const baseline: PerfBaseline = {
    schemaVersion: SCHEMA_VERSION,
    firstLoadJsGzipBytes: sizes,
  };
  writeFileSync(BASELINE_PATH, `${JSON.stringify(baseline, null, 2)}\n`);
};

const logBuildTime = (buildTimeMs: number | null) => {
  if (buildTimeMs !== null) {
    console.log(
      `build time (informational, not gated): ${(buildTimeMs / 1000).toFixed(1)}s`,
    );
  }
};

const run = (): number => {
  const metrics = measure({ reuse });

  if (command === 'measure') {
    console.log(JSON.stringify(metrics, null, 2));
    return 0;
  }

  const baseline = readBaseline();

  if (command === 'check') {
    if (!baseline) {
      console.error(
        'perf-baseline.json not found. Run `pnpm perf:update` first.',
      );
      return 1;
    }
    const result = compareMetrics(
      baseline.firstLoadJsGzipBytes,
      metrics.firstLoadJsGzipBytes,
    );
    console.log(formatDiffTable(result));
    logBuildTime(metrics.info.buildTimeMs);
    if (!result.passed) {
      console.error(
        '\nperf:check FAILED: First Load JS grew beyond tolerance. Reduce it, or explain the tradeoff to a human.',
      );
    }
    return result.passed ? 0 : 1;
  }

  if (command === 'update') {
    if (!baseline) {
      writeBaseline(metrics.firstLoadJsGzipBytes);
      console.log('Created perf-baseline.json');
      return 0;
    }
    const result = compareMetrics(
      baseline.firstLoadJsGzipBytes,
      metrics.firstLoadJsGzipBytes,
    );
    console.log(formatDiffTable(result));
    if (!result.passed && !force) {
      console.error(
        '\nperf:update refused: some routes regressed. The baseline only ratchets down (use --force to override with human approval).',
      );
      return 1;
    }
    writeBaseline(
      force
        ? metrics.firstLoadJsGzipBytes
        : ratchetBaseline(
            baseline.firstLoadJsGzipBytes,
            metrics.firstLoadJsGzipBytes,
          ),
    );
    console.log('Updated perf-baseline.json');
    return 0;
  }

  console.error(
    `Unknown command: ${command} (expected measure | check | update)`,
  );
  return 2;
};

try {
  process.exitCode = run();
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
