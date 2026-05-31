# ParaBank Smoke Test Suite

Playwright smoke test suite built with TypeScript against the [ParaBank demo application](https://parabank.parasoft.com/parabank/index.htm).

---

## Setup

### Prerequisites

- Node.js 18 or above

### Installation

All commands should be run from a terminal in the project root directory.

```bash
git clone https://github.com/doorstep75/parabank-smoke-tests.git
cd parabank-smoke-tests
npm install*
npx playwright install
```
* If installing on a corporate network, SSL certificate errors may occur with `npm install`. Running the following command before installing resolves this:
```bash
  npm config set strict-ssl false
```
### Environment configuration

Create a `.env` file from the provided example:

```bash
cp .env.example .env
```

> Windows users: use `copy .env.example .env` instead

Then fill in your credentials:

```
APP_USERNAME=your_username
PASSWORD=your_password
```

### ParaBank account and database state

> **Note:** The ParaBank demo database resets periodically, which may cause the API test to fail. If this happens, use the Admin page to **Clean** and **Initialize** the database, re-register your account, and update `.env` if your credentials changed.

---

## Running the tests

Run with the Playwright UI (recommended for local debugging):

```bash
npx playwright test --ui
```

Run smoke tests only headless:

```bash
npx playwright test tests/smoke
```

Run all tests headless:

```bash
npx playwright test
```

View the HTML report after a run:

```bash
npx playwright show-report
```

---

## Project structure

```
fixtures/         auth fixture that handles login for tests that require it
pages/            page object models for each journey
tests/
  smoke/          the 3 core smoke tests (1 UI login, 1 API transfer, 1 UI bill pay)
  bonus/          additional bank transfer ui test
```

---

## Assumptions

- A valid ParaBank account exists, credentials are provided via `.env`, and the database has been initialised as described in Setup
- The ParaBank demo environment is available and stable
- Tests run against Chromium by default. Firefox and WebKit are available but commented out in `playwright.config.ts` to keep the demo run focussed
- Static test data is used for demo purposes, see scaling notes below
- The login page does not need asserting before credentials are entered
- For Bill Pay, static data has been added to the object page, where test data files or fixtures would be used in bigger suites.
- Tests should never be run against production environments or use real personal data. All credentials must be stored in .env and excluded from version control, in line with GDPR and data protection best practices.
- TypeScript was chosen over JavaScript as it's my current day-to-day automation language. It also brings the added benefits of type safety and clearer interfaces, which proved useful when defining page object properties and helped with API response shapes. I would be happy to write in JavaScript if that's the team's preference.

---

## Why these 3 scenarios

The three tests were selected using a risk-based approach, prioritising the journeys with the highest financial impact if broken post-deployment.

**1. Login and Accounts Overview**
Everything in the application is gated behind authentication. If login fails, no user can access any feature. This is the highest priority smoke test for any session-based application. The accounts overview is asserted as part of the same test as it is the immediate landing page and confirms the session is active and account data has loaded.

**2. Transfer Funds (API)**
Transferring money is a core, frequent banking action with direct financial consequences if broken. Transfer Funds is tested at the API layer rather than UI.  The primary concern is financial data integrity, not the visual experience. The ParaBank REST API is publicly accessible and requires no additional tooling, making it a clean and reliable smoke test. This approach also aligns with the role's emphasis on API and integration testing.

**3. Bill Pay**
Similar risk profile to transfers, failing to pay a bill on time can result in financial penalties or missed critical payments. This is a distinct journey from Transfer Funds. UI was chosen over API as the experience matters here, a user must complete a multi field form and receive confirmation, making the full journey more meaningful to test than the underlying function alone.

On a personal level, these three felt like the journeys I would want working first if I logged into my own bank account.

Journeys considered and deprioritised:

- **Update Contact Info** — important but no direct financial consequence
- **Open New Account** — low frequency, no immediate financial impact if unavailable
- **Find Transactions** — read-only, no financial impact if broken
- **Request Loan** — low frequency, not a daily-use journey

---

## What I would add if expanding the suite

**Additional smoke tests:**

- Open New Account - proves the account creation flow end to end
- Update Contact Info — important for users with recent address or phone changes

**Regression coverage:**

- Negative login — invalid credentials and multiple failed logins show the correct error(s)
- Transfer validation — empty amount, invalid input, insufficient funds show relevant errors
- Bill Pay validation — missing required fields show inline errors and insufficient funds
- Account details drill-down — clicking an account number loads the correct details, note before and after transaction updates, overdrawn behaviour e. g. warning or alert on screen

**API tests:**

- `GET /accounts/{accountId}` — verify account details return correct shape and status
- `GET /customers/{customerId}/accounts` — verify accounts list returns correct shape and status
- `POST /billpay` — verify bill payment processes and returns confirmation
- `POST /createAccount` — verify new account creation returns a valid account ID
- `GET /accounts/{accountId}/transactions` — verify transactions load correctly after a transfer
- `POST /withdraw` and `POST /deposit` — verify balance updates correctly after each operation
- Schema validation on all key responses — lightweight contract testing to catch breaking API changes early
- `POST /cleanDB` and `POST /initializeDB` — use as global setup and teardown to ensure a consistent test data state between runs

**Other improvements:**

- Dynamic user generation via global setup was considered but ParaBank has no registration API endpoint, making it UI driven and not as reliable for this submission. The API test already demonstrates dynamic data resolution at runtime. ParaBank does expose `POST /cleanDB` and `POST /initializeDB` endpoints also which could reset and seed the database to a known state before each run in a more controlled environment.
- The Bill Pay form currently uses hardcoded placeholder data for payee address details. In a production suite these would be generated dynamically using a helper or a library such as Faker to ensure test independence
- Fixture file for multiple user types such as standard, locked and new to support a wider regression suite
- `data-testid` attributes requested from developers on key table cells and form elements to enable more precise and stable assertions, particularly on the accounts overview table
- Page object models could be extended to cover additional journeys such as Open New Account and Update Contact Info as the suite grows
- Environment specific configuration to allow the same suite to run against different environments such as staging and production without code changes

---

## Locator strategy notes

ParaBank is an older application and its HTML lacks label tags, ARIA attributes, and testid hooks on many elements. Where Playwright's preferred locators (`getByRole`, `getByLabel`) were not viable, attribute locators (`[name="..."]`) were used as the most stable available alternative.

Specific observations:

- Login fields use `[name="username"]` and `[name="password"]` no labels in the HTML
- Transfer form fields use `id` attributes.  No labels but IDs are stable
- Bill Pay fields use `name` attributes that are consistent and stable
- Accounts table cells have no targeting attributes.  Granular cell assertions were avoided in favour of table-level and link-level assertions

In a real engagement I would raise these as testability improvements with the development team.

---

## Nice to haves

All optional items from the brief are implemented:

| Feature                   | Implementation                                                                        |
| ------------------------- | ------------------------------------------------------------------------------------- |
| Reporting                 | HTML reporter configured in `playwright.config.ts` — run `npx playwright show-report` |
| Parallel execution        | `fullyParallel: true` in `playwright.config.ts`                                       |
| CI integration            | GitHub Actions workflow in `.github/workflows/` — triggers on push and PR to main     |
| Trace on failure          | `trace: 'on-first-retry'` in `playwright.config.ts`                                   |
| Screenshots on failure    | `screenshot: 'only-on-failure'` in `playwright.config.ts`                             |
| Environment configuration | `process.env` via `.env` — template provided in `.env.example`                        |
| Retry strategy            | `retries: process.env.CI ? 2 : 0` in `playwright.config.ts` — retries on CI only      |

---

## Bonus test

A bonus UI test for Transfer Funds is included in `tests/bonus/` as an alternative to the API smoke test. It demonstrates the same journey via the browser and can be run locally:

```bash
npx playwright test tests/bonus
```

## AI assistance

AI tooling was used during the development of this suite in the following ways:

- Reviewing and refining locator strategy for consistency and best practice
- Refactoring test structure to use `test.step` for improved readability and reporting
- Checking adherence to KISS and DRY principles across page objects and fixtures
- Verifying API response shape
- Proofreading and improving the wording and structure of this README

All test design decisions, scenario selection, risk-based reasoning and implementation were my own.
