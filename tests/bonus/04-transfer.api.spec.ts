import { test, expect } from '../../fixtures/auth.fixture';

test('Transfer funds between accounts via API', async ({ authenticatedPage }) => {
  const context = authenticatedPage.context();
  let accountId: number;
  let balanceBefore: number;

  await test.step('Get account details via API', async () => {
    const accountsResponse = await context.request.get(
      'https://parabank.parasoft.com/parabank/services_proxy/bank/accounts/14454' // assumes 
    );
    await expect(accountsResponse).toBeOK();
    const account = await accountsResponse.json();
    accountId = account.id;
    balanceBefore = account.balance;
    expect(accountId).toBeDefined();
    expect(balanceBefore).toBeDefined();
  });

  await test.step('Transfer $1 via API', async () => {
    const transferResponse = await context.request.post(
      `https://parabank.parasoft.com/parabank/services_proxy/bank/transfer?fromAccountId=${accountId}&toAccountId=${accountId}&amount=1`
    );
    await expect(transferResponse).toBeOK();
  });

  await test.step('Verify balance unchanged after same-account transfer', async () => {
    const verifyResponse = await context.request.get(
      `https://parabank.parasoft.com/parabank/services_proxy/bank/accounts/${accountId}`
    );
    await expect(verifyResponse).toBeOK();
    const accountAfter = await verifyResponse.json();
    expect(accountAfter.balance).toBe(balanceBefore);
  });
});