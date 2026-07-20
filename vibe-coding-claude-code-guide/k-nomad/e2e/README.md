# E2E tests

Playwright covers browser-level user flows that are not already covered by Vitest.

## Commands

- `npm run test:e2e`: run headless E2E tests.
- `npm run test:e2e:headed`: run tests with a visible browser.
- `npm run test:e2e:ui`: open the Playwright UI.

## Scope

- Home page smoke coverage.
- City search, region filtering, reset, and empty result state.
- City detail navigation.
- Unauthenticated vote redirect to login.

Authenticated voting is intentionally not automated yet because it needs a dedicated Supabase test user and isolated test data. Do not run write-based E2E tests against production data.

## Environment

Normal app runs must have valid Supabase public environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

The Playwright config starts Next.js automatically on `127.0.0.1:3000`. Override the port with `PLAYWRIGHT_PORT` or the full URL with `PLAYWRIGHT_BASE_URL`.

During Playwright webServer runs, `E2E_USE_FIXTURE_CITIES=true` is set so read-only city pages use local fixture data and do not depend on Supabase network availability.
