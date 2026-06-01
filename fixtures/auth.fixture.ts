import { test as base, expect, Page } from '@playwright/test';
import { randomUUID } from 'crypto';
import { LoginPage } from '../pages/LoginPage';
import { RegistrationPage } from '../pages/RegistrationPage';

type AuthFixtures = {
  credentials: { username: string; password: string };
  authenticatedPage: Page;
};

export const test = base.extend<AuthFixtures>({
  credentials: async ({ page }, use) => {
    const username = `u${randomUUID().replace(/-/g, '').slice(0, 12)}`;
    const password = 'Test1234!';
    const regPage = new RegistrationPage(page);
    await regPage.goto();
    await regPage.register({ username, password });
    await expect(page.getByRole('heading', { name: `Welcome ${username}` })).toBeVisible();
    await page.getByRole('link', { name: 'Log Out' }).click();
    await page.waitForURL('index.htm');
    await use({ username, password });
  },

  authenticatedPage: async ({ page, credentials }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(credentials.username, credentials.password);
    await page.waitForURL('overview.htm');
    await use(page);
  },
});

export { expect };
