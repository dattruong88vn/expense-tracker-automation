import { expect, test } from '../fixtures';

/**
 * Walking-skeleton check (Implementation Plan step 4.7): the Web application is
 * served, and a deep link is answered by the SPA navigation fallback.
 */
test.describe('Walking skeleton: application shell', () => {
  test('the root URL serves the application', async ({ appShell }) => {
    const response = await appShell.open('/');

    expect(response?.ok()).toBe(true);
    await expect(appShell.root).toBeVisible();
  });

  test('a deep link is served by the navigation fallback', async ({ appShell }) => {
    const response = await appShell.open('/transactions');

    expect(response?.ok()).toBe(true);
    await expect(appShell.root).toBeVisible();
  });
});
