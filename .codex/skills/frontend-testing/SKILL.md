---
name: frontend-testing
description: Write and maintain tests for k12-web using Vitest, React Testing Library, MSW, and Playwright. Use when adding or changing tests, testing a new feature, mocking k12-api responses, or deciding what level of test a behavior needs.
---

# Frontend Testing

## What to test where

| Level          | Tool               | Use for                                                                    |
| -------------- | ------------------ | -------------------------------------------------------------------------- |
| Unit           | Vitest             | Pure functions, Zod schemas, stores, query-key factories, error mapping    |
| Component/hook | Vitest + RTL + MSW | User-visible behavior of components and hooks against mocked API responses |
| End-to-end     | Playwright         | Critical journeys: login, password change, school switch, key module flows |

Test behavior users and callers observe, not implementation details (no testing internal state,
private functions, or MUI class names). Every bug fix gets a test that fails without the fix.

## Conventions

- Unit/component tests sit next to the code: `<file>.test.ts(x)`. E2E tests live in `e2e/` as
  `<flow>.spec.ts`.
- Arrange–Act–Assert, one behavior per test, descriptive names (`shows a generic error when
credentials are rejected`).
- Render through a shared test util that provides `QueryClientProvider` (fresh client per test,
  retries off), MUI theme, and router mocks.
- Query priority: `getByRole` (with `name`) → `getByLabelText` → `getByText` → `getByTestId` as a
  last resort. Use `userEvent`, not `fireEvent`. Await async UI with `findBy*`/`waitFor`.
- Reset stores, MSW handlers, and timers between tests. No test depends on another's order.

## API mocking (MSW)

- Mock at the network layer with MSW handlers typed from generated API types; never mock the
  fetch client or hooks themselves.
- Default handlers in `src/test/msw/handlers.ts` return realistic success payloads; override per
  test with `server.use(...)` for errors (400 array messages, 401, 403, 404, 409, 429, 500).
- Cover the auth flow: 401 → single refresh → retry; failed refresh signs out; concurrent 401s
  trigger one refresh.
- Fail tests on unhandled requests (`onUnhandledRequest: 'error'`).

## E2E (Playwright)

- Use role/label locators and web-first assertions (`await expect(locator).toBeVisible()`); no
  fixed sleeps.
- Run against a seeded k12-api test database or route-level mocks; never against production data.
- Keep the suite small and focused on critical paths; include one accessibility scan
  (`@axe-core/playwright`) per main page once added.

## Guardrails

- Never delete, skip, or loosen a test to make CI pass; fix the code or the test's wrong assumption.
- No snapshot tests for whole pages; small inline snapshots only for stable serialized output.
- Keep tests deterministic: fixed dates/timers, no real network, no reliance on locale/timezone.
