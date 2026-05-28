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
npm install
npx playwright install
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
FIRST_NAME=your_first_name
SECOND_NAME=your_second_name
```

---

## Running the tests

Run all tests headless:
```bash
npx playwright test
```

Run with the Playwright UI (recommended for local debugging):
```bash
npx playwright test --ui
```

Run smoke tests only:
```bash
npx playwright test tests/smoke
```

View the HTML report after a run:
```bash
npx playwright show-report
```

---

## Project structure

```
fixtures/         auth fixture — handles login for tests that require it
pages/            page object models for each journey
tests/
  smoke/          the 3 core smoke tests
  bonus/          bonus API test (proof of concept)
```

---

## Assumptions

- A valid ParaBank account exists and credentials are provided via `.env`
- The ParaBank demo environment is available and stable
- Tests run against Chromium by default — Firefox and WebKit are available but commented out in `playwright.config.ts` to keep the demo run focused
- Static test data is used for demo purposes — see scaling notes below
- The login page does not need asserting before credentials are entered
- For Bill Pay, payee address details are placeholder data — the meaningful assertions are on the payment confirmation

---

## Why these 3 scenarios

The three tests were selected using a risk-based approach — prioritising the journeys with the highest financial impact if broken post-deployment.

**1. Login and Accounts Overview**
Everything in the application is gated behind authentication. If login fails, no user can access any feature. This is the highest priority smoke test for any session-based application. The accounts overview is asserted as part of the same test as it is the immediate landing page and confirms the session is active and account data has loaded.

**2. Transfer Funds**
Transferring money is a core, frequent banking action. A broken transfer engine has direct and immediate financial consequences for users — missed payments, failed transactions, potential penalties. This is tested second as it depends on a successful login.

**3. Bill Pay**
Similar risk profile to transfers — failing to pay a bill on time can result in financial penalties or missed critical payments. This is a distinct journey from Transfer Funds, using a different form and a separate API call, making it a meaningful addition to the smoke suite.

Journeys considered and deprioritised:
- **Open New Account** — low frequency, no immediate financial impact if unavailable
- **Find Transactions** — read-only, no financial impact if broken
- **Update Contact Info** — important but no direct financial consequence
- **Request Loan** — low frequency, not a daily-use journey

On a personal level, these three felt like the journeys I would want working first if I logged into my own bank account.

---

## What I would add if expanding the suite

**Additional smoke tests:**
- Open New Account — proves the account creation flow end to end
- Update Contact Info — important for users with recent address or phone changes

**Regression coverage:**
- Negative login — invalid credentials show the correct error
- Transfer validation — empty amount or invalid input shows errors
- Bill Pay validation — missing required fields show inline errors
- Account details drill-down — clicking an account number loads the correct details

**API tests:**
- `GET /customers/{id}/accounts` — accounts endpoint returns correct shape and status
- `POST /transfer` — transfer updates balances correctly (cross-layer verification)
- `POST /billpay` — payment processes and returns confirmation
- Schema validation on all key responses — lightweight contract testing to catch breaking API changes early

**Other improvements:**
- Dynamic user generation using a helper and global setup, to avoid reliance on a static test account on a shared demo environment
- Fixture file for multiple user types (standard, locked, new) to support a wider regression suite
- `data-testid` attributes requested from developers on key table cells and form elements to enable more precise and stable assertions — particularly on the accounts overview table

---

## Locator strategy notes

ParaBank is an older application and its HTML lacks label tags, ARIA attributes, and testid hooks on many elements. Where Playwright's preferred locators (`getByRole`, `getByLabel`) were not viable, attribute locators (`[name="..."]`) were used as the most stable available alternative.

Specific observations:
- Login fields use `[name="username"]` and `[name="password"]` — no labels in the HTML
- Transfer form fields use `id` attributes — no labels, but IDs are stable
- Bill Pay fields use `name` attributes — consistent and stable
- Accounts table cells have no targeting attributes — granular cell assertions were avoided in favour of table-level and link-level assertions

In a real engagement I would raise these as testability improvements with the development team.

---

## Nice to haves

All optional items from the brief are implemented:

| Feature | Implementation |
|---|---|
| Reporting | HTML reporter configured in `playwright.config.ts` — run `npx playwright show-report` |
| Parallel execution | `fullyParallel: true` in `playwright.config.ts` |
| CI integration | GitHub Actions workflow in `.github/workflows/` — triggers on push and PR to main |
| Trace on failure | `trace: 'on-first-retry'` in `playwright.config.ts` |
| Screenshots on failure | `screenshot: 'only-on-failure'` in `playwright.config.ts` |
| Environment configuration | `process.env` via `.env` — template provided in `.env.example` |
| Retry strategy | `retries: process.env.CI ? 2 : 0` in `playwright.config.ts` — retries on CI only |

---

## Bonus — API test

A bonus API test is included in `tests/bonus/` demonstrating Playwright's native API testing capability using session reuse from the authenticated browser context.

The test authenticates via the UI, then uses `context.request` to call the ParaBank REST API directly — a legitimate and common pattern for session-authenticated applications where a standalone login endpoint is not publicly exposed.

Note: the account ID in the bonus test is currently static and tied to the test account. In a production suite this would be resolved dynamically from the accounts list post-login.

Transfer Funds would be a strong candidate for API-level smoke testing in a real environment — financial data integrity is better verified at the API layer than through visual confirmation alone.

## AI assistance

AI tooling was used during the development of this suite in the following ways:

- Reviewing and refining locator strategy for consistency and best practice
- Refactoring test structure to use `test.step` for improved readability and reporting
- Checking adherence to KISS and DRY principles across page objects and fixtures
- Proofreading and improving the wording and structure of this README

All test design decisions, scenario selection, risk-based reasoning, and implementation were my own.