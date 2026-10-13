<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Repository instructions for coding agents

## Project

Next.js 16 (App Router, `src/`) + React 19 + TypeScript frontend for KidzDiary, a multi-school
information system. The backend is the sibling NestJS repo `../k12-api`; features are built module
by module in both. Read `docs/ARCHITECTURE.md` before substantial work. Its decisions (API access,
state, tenancy, structure, testing) are binding; change them only through an explicit, recorded
decision. When a choice is not covered there, ask the user instead of picking silently.

## Commands

- Setup: `nvm use` (Node 24), `npm install`, `cp .env.example .env.local`.
- Develop/build: `npm run dev` (port 3001), `npm run build`, `npm run start`.
- Quality: `npm run lint`, `npm run typecheck`, `npm run format:check`, `npm test`
  (`npm run test:e2e` once Playwright is added).
- API types: `npm run api:types` regenerates `src/lib/api/schema.d.ts` from the running k12-api;
  run it whenever the backend contract changes and commit the result.

## Non-negotiable rules

- TypeScript strict. No `any`, no non-null `!` on untrusted data, no `@ts-ignore`; use
  `@ts-expect-error` with a reason only when unavoidable. Validate data at trust boundaries.
- Feature code lives in `src/modules/<module>/` and is imported by other code only through its
  `index.ts`. `src/app/` route files stay thin: compose module components, no business logic.
- Server Components by default; add `'use client'` only at the smallest leaf that needs state,
  effects, browser APIs, or event handlers.
- All k12-api calls go through the typed client in `src/lib/api/` using generated types; server data
  is cached with TanStack Query. Zustand holds client-only state; never copy API data into it.
- Access tokens live in memory only. Never put tokens, secrets, or personal data in
  `localStorage`, URLs, logs, or `NEXT_PUBLIC_*` variables. Only non-sensitive preferences (e.g.
  the active membership ID, UI settings) may be persisted. Never use `dangerouslySetInnerHTML`
  with untrusted content.
- UI is built with MUI. Visual design rules will come from the KidzDiary design system (not yet
  defined); until then do not invent a palette, typography scale, or component styling.
- Forms use React Hook Form + Zod mirroring the backend DTO rules; the backend stays authoritative.
- Route guards and role-based UI are UX only. k12-api enforces authorization; never rely on hiding.
- Filenames are kebab-case (`login-form.tsx`, `use-login.ts`); components and types PascalCase;
  functions, variables and hooks camelCase; constants UPPER_SNAKE_CASE.
- Do not add a dependency when an existing one solves the problem; justify any new dependency.
- Add or update behavioral tests with each change. Never delete or weaken tests to pass CI.

## Repository-local skills

Skills live in `.codex/skills/` (`.claude/skills` links to the same files):

- `frontend-coding-guidelines`: always, for any code change in this repo.
- `create-frontend-module`: adding a feature module or a new feature area.
- `api-integration`: calling k12-api, generated types, query hooks, auth/session handling.
- `ui-component`: building pages, layouts, and components with MUI.
- `form`: any form, input validation, or mutation submitted by a user.
- `frontend-testing`: writing or changing unit, component, or E2E tests.
- `review-frontend-change`: before completing or handing off a substantive change.

## Safe change workflow

Before a substantial feature: (1) read the architecture doc and affected modules, (2) confirm the
backend contract in k12-api Swagger, (3) state a concise plan, (4) implement the smallest coherent
change, (5) run lint, typecheck, tests, and build, (6) summarize changed files, tests, contract
assumptions, and trade-offs. Do not claim checks that were not run.
