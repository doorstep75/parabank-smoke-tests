import { test, expect } from '../../fixtures/auth.fixture';
import { LoginPage } from '../../pages/LoginPage';
import { OverviewPage } from '../../pages/OverviewPage';

test('User can log in and view accounts overview', async ({ page, credentials }) => {
  const loginPage = new LoginPage(page);
  const overviewPage = new OverviewPage(page);
  let waitForAccountsTable: ReturnType<typeof page.waitForResponse>;

  await test.step('Navigate to login page', async () => {
    await loginPage.goto();
  });

  await test.step('Log in', async () => {
    waitForAccountsTable = overviewPage.waitForAccountsLoaded();
    await loginPage.login(credentials.username, credentials.password);
  });

  await test.step('Assert landing page', async () => {
    await expect(page).toHaveURL('overview.htm');
    await expect(overviewPage.welcomeHeading).toBeVisible();
    await expect(overviewPage.accountServicesHeading).toBeVisible();
  });

  await test.step('Assert accounts table has loaded with data', async () => {
    await waitForAccountsTable;
    await expect(overviewPage.accountsOverviewHeading).toBeVisible();
    await expect(overviewPage.accountTable).toBeVisible();
    await expect(overviewPage.accountLink).toBeVisible();
    await expect(overviewPage.balanceDisclaimer).toBeVisible();
  });
});
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { OverviewPage } from '../../pages/OverviewPage';

test('User can log in and view accounts overview', async ({ page }) => {
  const username = process.env.APP_USERNAME!;
  const password = process.env.PASSWORD!;

  const loginPage = new LoginPage(page);
  const overviewPage = new OverviewPage(page);
  let waitForAccountsTable: ReturnType<typeof page.waitForResponse>;

  await test.step('Navigate to login page', async () => {
    await loginPage.goto();
  });

  await test.step('Log in', async () => {
    waitForAccountsTable = overviewPage.waitForAccountsLoaded();
    await loginPage.login(username, password);
  });

  await test.step('Assert landing page', async () => {
    await expect(page).toHaveURL('overview.htm');
    await expect(overviewPage.welcomeHeading).toBeVisible();
    await expect(overviewPage.accountServicesHeading).toBeVisible();
  });

  await test.step('Assert accounts table has loaded with data', async () => {
    await waitForAccountsTable;
    await expect(overviewPage.accountsOverviewHeading).toBeVisible();
    await expect(overviewPage.accountTable).toBeVisible();
    await expect(overviewPage.accountLink).toBeVisible();
    await expect(overviewPage.balanceDisclaimer).toBeVisible();
  });
});
