import { test, expect } from '../../fixtures/auth.fixture';
import { TransferPage } from '../../pages/TransferPage';

test('User can transfer funds between accounts', async ({ authenticatedPage }) => {
  const transferPage = new TransferPage(authenticatedPage);

  await test.step('Navigate to Transfer Funds', async () => {
    await transferPage.goto();
    await expect(authenticatedPage).toHaveURL('transfer.htm');
  });

  await test.step('Assert Transfer Funds form is loaded', async () => {
    await expect(transferPage.heading).toBeVisible();
    await expect(transferPage.amountInput).toBeVisible();
    await expect(transferPage.amountInput).toHaveValue('');
    await expect(transferPage.fromAccount).toHaveValue(/\d+/);
    await expect(transferPage.toAccount).toHaveValue(/\d+/);
  });

  await test.step('Transfer $1', async () => {
    await transferPage.transferFunds('1');
  });

  await test.step('Assert transfer was successful', async () => {
    await expect(transferPage.successHeading).toBeVisible();
    await expect(transferPage.amountResult).toHaveText('$1.00');
    await expect(transferPage.fromAccountResult).toHaveText(/\d+/);
    await expect(transferPage.toAccountResult).toHaveText(/\d+/);
  });
});