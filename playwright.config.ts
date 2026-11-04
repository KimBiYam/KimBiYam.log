import { defineConfig, devices } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

export default defineConfig({
  testDir: 'e2e',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    {
      name: 'mobile',
      use: { ...devices['Pixel 7'], browserName: 'chromium' },
    },
  ],
  webServer: {
    // CI 는 별도 단계에서 빌드한다.
    command: process.env.CI ? 'pnpm start' : 'pnpm build && pnpm start',
    stdout: 'pipe',
    // 자동화 실행이 운영 Sentry/GA 로 데이터를 보내지 않도록 빌드와 서버 양쪽에 적용한다.
    env: {
      NEXT_PUBLIC_SENTRY_DISABLED: 'true',
      NEXT_PUBLIC_GOOGLE_ANALYTICS_TRACKING_ID: '',
    },
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 300_000,
  },
});
