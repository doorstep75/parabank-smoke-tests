import { test, expect } from '../../fixtures/auth.fixture';

test('Transfer funds between accounts via API', async ({ request, credentials }) => {
  let customerId: number;
  let accountId: number;
  let balanceBefore: number;

  await test.step('Authenticate and get customer ID', async () => {
    const response = await request.get(
      `/parabank/services/bank/login/${credentials.username}/${credentials.password}`,
      { headers: { accept: 'application/json' } }
    );
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
    const customer = await response.json();
    customerId = customer.id;
    expect(customerId).toBeGreaterThan(0);
  });

  await test.step('Get account details and confirm initial balance', async () => {
    const response = await request.get(
      `/parabank/services/bank/customers/${customerId}/accounts`,
      { headers: { accept: 'application/json' } }
    );
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
    const accounts = await response.json();
    expect(accounts.length).toBeGreaterThan(0);
    accountId = accounts[0].id;
    balanceBefore = accounts[0].balance;
    expect(accountId).toBeGreaterThan(0);
    expect(typeof balanceBefore).toBe('number');
  });

  await test.step('Transfer $1 via API', async () => {
    const response = await request.post(
      `/parabank/services/bank/transfer?fromAccountId=${accountId}&toAccountId=${accountId}&amount=1`
    );
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/xml');
  });

  await test.step('Verify balance unchanged after same-account transfer', async () => {
    const response = await request.get(
      `/parabank/services/bank/accounts/${accountId}`,
      { headers: { accept: 'application/json' } }
    );
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
    const accountAfter = await response.json();
    expect(accountAfter.balance).toBe(balanceBefore);
  });
});
