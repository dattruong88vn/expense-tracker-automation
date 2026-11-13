import { defineConfig, devices } from '@playwright/test';
import { env } from './shared/env';

const isCI = Boolean(process.env.CI);

/**
 * One runner and one report for two independent suites:
 * - `api` runs api-tests over HTTP only (no browser) against API_URL.
 * - `ui-desktop` and `ui-mobile` run ui-tests in a real browser against BASE_URL.
 */
export default defineConfig({
  globalSetup: './shared/global-setup.ts',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'api',
      testDir: './api-tests/specs',
      use: {
        baseURL: env.apiUrl,
      },
    },
    {
      name: 'ui-desktop',
      testDir: './ui-tests/specs',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 800 },
        baseURL: env.baseUrl,
        screenshot: 'only-on-failure',
      },
    },
    {
      name: 'ui-mobile',
      testDir: './ui-tests/specs',
      use: {
        ...devices['Pixel 5'],
        viewport: { width: 375, height: 812 },
        baseURL: env.baseUrl,
        screenshot: 'only-on-failure',
      },
    },
  ],
});
