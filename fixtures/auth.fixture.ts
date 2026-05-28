import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

type AuthFixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(process.env.APP_USERNAME!, process.env.PASSWORD!);
    await page.waitForURL('overview.htm');
    await use(page);
  },
});

export { expect } from '@playwright/test';
