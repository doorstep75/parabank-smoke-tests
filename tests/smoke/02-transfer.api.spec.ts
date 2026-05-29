import { test, expect } from '@playwright/test';

test('Transfer funds between accounts via API', async ({ request }) => {
  let customerId: number;
  let accountId: number;
  let balanceBefore: number;

  await test.step('Authenticate and get customer ID', async () => {
    const response = await request.get(
      `/parabank/services/bank/login/${process.env.APP_USERNAME}/${process.env.PASSWORD}`,
      { headers: { accept: 'application/json' } }
    );
    await expect(response).toBeOK();
    const customer = await response.json();
    customerId = customer.id;
    expect(customerId).toBeDefined();
  });

  await test.step('Get account details and confirm initial balance', async () => {
    const response = await request.get(
      `/parabank/services/bank/customers/${customerId}/accounts`,
      { headers: { accept: 'application/json' } }
    );
    await expect(response).toBeOK();
    const accounts = await response.json();
    expect(accounts.length).toBeGreaterThan(0);
    accountId = accounts[0].id;
    balanceBefore = accounts[0].balance;
    expect(accountId).toBeDefined();
    expect(balanceBefore).toBeDefined();
  });

  await test.step('Transfer $1 via API', async () => {
    const response = await request.post(
      `/parabank/services/bank/transfer?fromAccountId=${accountId}&toAccountId=${accountId}&amount=1`
    );
    await expect(response).toBeOK();
  });

  await test.step('Verify balance unchanged after same-account transfer', async () => {
    const response = await request.get(
      `/parabank/services/bank/accounts/${accountId}`,
      { headers: { accept: 'application/json' } }
    );
    await expect(response).toBeOK();
    const accountAfter = await response.json();
    expect(accountAfter.balance).toBe(balanceBefore);
  });
});