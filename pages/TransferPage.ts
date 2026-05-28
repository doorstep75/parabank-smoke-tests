import { Page } from '@playwright/test';

export class TransferPage {
  readonly heading;
  readonly amountInput;
  readonly fromAccount;
  readonly toAccount;
  readonly transferButton;
  readonly successHeading;
  readonly amountResult;
  readonly fromAccountResult;
  readonly toAccountResult;

  constructor(private page: Page) {
    this.heading = page.getByRole('heading', { name: 'Transfer Funds' });
    this.amountInput = page.locator('#amount');
    this.fromAccount = page.locator('#fromAccountId');
    this.toAccount = page.locator('#toAccountId');
    this.transferButton = page.locator('[value="Transfer"]');
    this.successHeading = page.getByRole('heading', { name: 'Transfer Complete!' });
    this.amountResult = page.locator('#amountResult');
    this.fromAccountResult = page.locator('#fromAccountIdResult');
    this.toAccountResult = page.locator('#toAccountIdResult');
  }

  async goto() {
    await this.page.goto('transfer.htm');
  }

  async transferFunds(amount: string) {
    await this.amountInput.fill(amount);
    await this.transferButton.click();
  }
}