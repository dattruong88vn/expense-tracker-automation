import { test as base } from '@playwright/test';
import { AppShellPage } from '../pages/app-shell.page';

type UiFixtures = {
  appShell: AppShellPage;
};

/**
 * Fixtures of the UI suite. Background data (test users, seeded transactions)
 * and cleanup are provided here through factories in shared/, never in the test body.
 */
export const test = base.extend<UiFixtures>({
  appShell: async ({ page }, use) => {
    await use(new AppShellPage(page));
  },
});

export { expect } from '@playwright/test';
