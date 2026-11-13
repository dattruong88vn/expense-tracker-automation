import { expect, request } from '@playwright/test';

/**
 * Polls GET /health until it returns 200, because App Service F1 may be
 * sleeping. Waiting is condition-based (expect.poll), never a fixed sleep.
 */
export async function warmUp(apiUrl: string, timeoutMs: number): Promise<void> {
  const context = await request.newContext({ baseURL: apiUrl });
  try {
    await expect
      .poll(
        async () => {
          try {
            const response = await context.get('/health', { timeout: 15_000 });
            return response.status();
          } catch {
            return 0;
          }
        },
        {
          message: `API at ${apiUrl} did not report healthy within ${timeoutMs} ms`,
          timeout: timeoutMs,
          intervals: [1_000, 2_000, 5_000],
        },
      )
      .toBe(200);
  } finally {
    await context.dispose();
  }
}
