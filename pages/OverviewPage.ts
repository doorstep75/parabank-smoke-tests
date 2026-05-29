import { Page } from '@playwright/test';

export class OverviewPage {
  readonly welcomeHeading;
  readonly accountServicesHeading;
  readonly accountsOverviewHeading;
  readonly accountTable;
  readonly accountLink;
  readonly balanceDisclaimer;

  constructor(private page: Page) {
    this.welcomeHeading = page.locator('p.smallText').getByText(/Welcome \w+/);
    this.accountServicesHeading = page.getByRole('heading', { name: 'Account Services' });
    this.accountsOverviewHeading = page.getByRole('heading', { name: 'Accounts Overview' });
    this.accountTable = page.locator('#accountTable');
    this.accountLink = page.getByRole('link', { name: /\d+/ }).first(); // check at least one account link exists
    this.balanceDisclaimer = page.getByText('Balance includes deposits');
  }

  async waitForAccountsLoaded() {
    return this.page.waitForResponse('**/services_proxy/bank/customers/**/accounts');
  }
}
