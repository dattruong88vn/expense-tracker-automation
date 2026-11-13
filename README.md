# expense-tracker-automation

Black-box automation suites for Expense Tracker, executed with Playwright Test against a deployed (or locally running) environment. The repository holds two independent suites that share one runner and one report:

| Suite          | Directory    | Playwright project                           | Target     | Browser                             |
| -------------- | ------------ | -------------------------------------------- | ---------- | ----------------------------------- |
| API automation | `api-tests/` | `api`                                        | `API_URL`  | none (HTTP only, `request` fixture) |
| UI automation  | `ui-tests/`  | `ui-desktop` (1280 px), `ui-mobile` (375 px) | `BASE_URL` | Chromium                            |

The test strategy, the scenario catalogue (UI-xx, API-xx) and the entry and exit criteria are defined on the Test Strategy and Test Plan page in the Confluence space `ET`.

## Structure

```text
api-tests/
  specs/      API scenarios (API-xx)
  clients/    ApiClient wrapping Playwright's request fixture
  schemas/    response schemas taken from the API's openapi.json, validated with Ajv
ui-tests/
  specs/      UI scenarios (UI-xx)
  pages/      one Page Object per page; selectors by role and accessible label
  fixtures/   test data set-up and cleanup, outside the test body
shared/       environment access, warm-up, test data factories
playwright.config.ts
```

`api-tests` and `ui-tests` never import from each other; both import only from `shared/`. ESLint enforces this boundary.

## Prerequisites

- Node.js 22 or later.
- For the UI suite only: `npx playwright install chromium` (browsers are not stored in the repository).

## Configuration

Copy `.env.example` to `.env` and set:

| Variable             | Meaning                                                           |
| -------------------- | ----------------------------------------------------------------- |
| `API_URL`            | Origin of the API, without a trailing slash and without `/api/v1` |
| `BASE_URL`           | Origin of the Web application                                     |
| `WARM_UP_TIMEOUT_MS` | Optional; upper bound of the warm-up (default 60000)              |

No secret is stored in this repository. Values required by the CI workflow are held in GitHub Variables and Secrets.

Before any test runs, the global setup polls `GET /health` until it returns 200 (up to `WARM_UP_TIMEOUT_MS`), because the App Service F1 instance may be sleeping.

## Running

```bash
npm ci
npx playwright test --list                       # list projects and tests without running them
npx playwright test --project=api                # API suite
npx playwright test --project=api --grep @smoke  # API smoke subset
npx playwright test --project=ui-desktop         # UI suite, desktop
npx playwright test --project=ui-mobile          # UI suite, 375 px mobile
npx playwright test --grep @smoke                # smoke subset of both suites
npx playwright show-report                       # open the HTML report
```

With `CI` set, failed tests are retried twice, a trace is recorded on the first retry and the UI suite captures a screenshot on failure. A test that passes only after a retry is reported as a `flaky` Bug in Jira; tests are never disabled to obtain a green run.

## Smoke suite

Tests tagged `@smoke` run after every deployment. The smoke suite initially comprises API-13 (`GET /health` returns 200) and is extended with each Story.

## Quality checks

```bash
npm run lint          # ESLint (TypeScript, Playwright rules, suite boundary)
npm run typecheck     # tsc --noEmit
npm run format:check  # Prettier
```

Husky runs lint-staged on `pre-commit` and commitlint (Conventional Commits) on `commit-msg`.

## Conventions

- Each test uses its own user; tests are independent and may run in parallel.
- Waiting is condition-based (web-first assertions, `expect.poll`); fixed sleeps are not used.
- Tokens are never written to logs or reports.
- Branches `test/ET-<n>-<description>`; Pull Request titles are Conventional Commits containing `ET-<n>`.
