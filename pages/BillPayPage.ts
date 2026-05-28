import { Page } from '@playwright/test';

export class BillPayPage {
  readonly heading;
  readonly successHeading;
  readonly payeeNameResult;
  readonly amountResult;
  readonly fromAccountResult;
  readonly payeeNameInput;
  readonly streetInput;
  readonly cityInput;
  readonly stateInput;
  readonly zipInput;
  readonly phoneInput;
  readonly accountNumberInput;
  readonly verifyAccountInput;
  readonly amountInput;
  readonly sendPaymentButton;

  constructor(private page: Page) {
    this.heading = page.getByRole('heading', { name: 'Bill Payment Service' });
    this.successHeading = page.getByRole('heading', { name: 'Bill Payment Complete' });
    this.payeeNameResult = page.locator('#payeeName');
    this.amountResult = page.locator('#amount');
    this.fromAccountResult = page.locator('#fromAccountId');
    this.payeeNameInput = page.locator('[name="payee.name"]');
    this.streetInput = page.locator('[name="payee.address.street"]');
    this.cityInput = page.locator('[name="payee.address.city"]');
    this.stateInput = page.locator('[name="payee.address.state"]');
    this.zipInput = page.locator('[name="payee.address.zipCode"]');
    this.phoneInput = page.locator('[name="payee.phoneNumber"]');
    this.accountNumberInput = page.locator('[name="payee.accountNumber"]');
    this.verifyAccountInput = page.locator('[name="verifyAccount"]');
    this.amountInput = page.locator('[name="amount"]');
    this.sendPaymentButton = page.locator('[value="Send Payment"]');
  }

  async goto() {
    await this.page.goto('billpay.htm');
  }

  async fillPayeeDetails(payeeName: string, amount: string) {
    await this.payeeNameInput.fill(payeeName);
    await this.streetInput.fill('123 Test Street');
    await this.cityInput.fill('Manchester');
    await this.stateInput.fill('Greater Manchester');
    await this.zipInput.fill('M1 1AA');
    await this.phoneInput.fill('07700900000');
    await this.accountNumberInput.fill('12345');
    await this.verifyAccountInput.fill('12345');
    await this.amountInput.fill(amount);
  }

  async sendPayment() {
    await this.sendPaymentButton.click();
  }
}
