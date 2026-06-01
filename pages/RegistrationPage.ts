import { Page } from '@playwright/test';

interface RegistrationData {
  username: string;
  password: string;
}

export class RegistrationPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('register.htm');
  }

  async register({ username, password }: RegistrationData) {
    await this.page.locator('[id="customer.firstName"]').fill('Test');
    await this.page.locator('[id="customer.lastName"]').fill('User');
    await this.page.locator('[id="customer.address.street"]').fill('123 Main St');
    await this.page.locator('[id="customer.address.city"]').fill('Stretford');
    await this.page.locator('[id="customer.address.state"]').fill('Manchester');
    await this.page.locator('[id="customer.address.zipCode"]').fill('M11 1AA');
    await this.page.locator('[id="customer.phoneNumber"]').fill('01611234567');
    await this.page.locator('[id="customer.ssn"]').fill('555555555');
    await this.page.locator('[id="customer.username"]').fill(username);
    await this.page.locator('[id="customer.password"]').fill(password);
    await this.page.locator('[id="repeatedPassword"]').fill(password);
    await this.page.getByRole('button', { name: 'Register' }).click();
  }
}
