import { test, expect } from '../../fixtures/auth.fixture';
import { BillPayPage } from '../../pages/BillPayPage';

test('User can submit a bill payment', async ({ authenticatedPage }) => {
  const billPayPage = new BillPayPage(authenticatedPage);
  const payeeName = 'Test Payee';
  const amount = '1';

  await test.step('Navigate to Bill Pay', async () => {
    await billPayPage.goto();
    await expect(authenticatedPage).toHaveURL('billpay.htm');
  });

  await test.step('Assert Bill Pay form is loaded', async () => {
    await expect(billPayPage.heading).toBeVisible();
  });

  await test.step('Fill in payee details and submit', async () => {
    await billPayPage.fillPayeeDetails(payeeName, amount);
    await billPayPage.sendPayment();
  });

  await test.step('Assert payment was successful', async () => {
    await expect(billPayPage.successHeading).toBeVisible();
    await expect(billPayPage.payeeNameResult).toHaveText(payeeName);
    await expect(billPayPage.amountResult).toHaveText('$1.00');
    await expect(billPayPage.fromAccountResult).toHaveText(/\d+/);
  });
});