import type { Page, Response } from '@playwright/test';

/**
 * Page Object for the application shell served by Azure Static Web Apps.
 * Feature pages (sign-in, transactions, categories, home) each receive their
 * own Page Object and select elements by role and accessible label.
 */
export class AppShellPage {
  constructor(private readonly page: Page) {}

  async open(path = '/'): Promise<Response | null> {
    return this.page.goto(path);
  }

  /** The root element into which the single-page application renders. */
  get root() {
    return this.page.locator('body');
  }
}
