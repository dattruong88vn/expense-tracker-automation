import type { FullConfig } from '@playwright/test';
import { env, required } from './env';
import { warmUp } from './warm-up';

/**
 * Global setup shared by the API and UI suites: wakes the deployed API before
 * any test runs. Both suites depend on the API, so API_URL is always required.
 */
export default async function globalSetup(_config: FullConfig): Promise<void> {
  await warmUp(required('API_URL'), env.warmUpTimeoutMs);
}
