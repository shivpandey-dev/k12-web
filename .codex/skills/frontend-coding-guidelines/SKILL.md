---
name: frontend-coding-guidelines
description: Industry-standard coding guidelines for the k12-web Next.js/React/TypeScript frontend. Use for any code change in this repository — components, routes, hooks, utilities, styling, configuration, or refactors — to apply its TypeScript, React, Next.js App Router, naming, security, accessibility, performance, and error-handling rules.
---

# Frontend Coding Guidelines

Read `AGENTS.md` and `docs/ARCHITECTURE.md` first. These guidelines refine them; on conflict the
architecture doc wins. Next.js 16 differs from older versions: check
`node_modules/next/dist/docs/` before using a Next API you are not sure about.

## TypeScript

- `strict` stays on. No `any`; use `unknown` and narrow. No `as` casts to silence errors; fix the
  type or validate with Zod. No non-null `!` except on values the code itself just proved present.
- Model states as discriminated unions (`{ status: 'loading' } | { status: 'ready'; data }`), not
  bags of optional booleans. Make impossible states unrepresentable.
- Prefer `type` imports (`import type`) and named exports. Default exports only where Next requires
  them (`page.tsx`, `layout.tsx`, `error.tsx`, ...).
- API shapes come from generated k12-api types; never hand-copy a backend DTO.
- Use `as const` objects or union literals instead of TypeScript `enum`.
- Exhaustive `switch` on unions with a `never` check in `default`.

## Naming and files

- Files and folders: kebab-case (`school-switcher.tsx`, `use-active-school.ts`).
- Components, types, interfaces: PascalCase. Hooks: `useX`. Booleans: `is/has/can/should` prefix.
  Event props `onX`, handlers `handleX`. Constants: UPPER_SNAKE_CASE.
- One exported component per file; small private helpers may share it.
- Name for the domain (`MembershipRole`, `activeSchoolId`), not the implementation (`data2`, `obj`).

## React

- Function components only. Follow the Rules of Hooks; never disable `react-hooks` lint rules.
- Derive values during render instead of syncing them into state with `useEffect`. Effects are
  for synchronizing with external systems only; every effect cleans up what it starts.
- Keep state as local as possible; lift only when shared. Server data → TanStack Query; shared
  client-only state → Zustand; URL-worthy state (filters, page, tab) → search params.
- Stable, unique `key`s from data IDs, never array indexes for dynamic lists.
- Do not add `useMemo`/`useCallback`/`memo` by reflex; add them for a measured problem or a
  referential-equality requirement.
- Components stay small and focused: split when a component mixes data fetching, layout, and
  complex interaction, or exceeds ~200 lines.
- Props: explicit interface, minimal surface, no prop drilling past two levels (compose with
  `children` or move state to a store/context).

## Next.js App Router

- Server Components by default. Put `'use client'` on the smallest interactive leaf, never on a
  layout or page just for convenience. Pass only serializable props across the boundary.
- `src/app/` holds routing only: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`,
  `not-found.tsx` that compose module components. Use route groups (`(auth)`, `(app)`) for layouts.
- Provide `loading.tsx`/Suspense and `error.tsx` boundaries for each major segment.
- Use `next/link` for navigation, `next/image` for images, `next/font` for fonts, `metadata`/
  `generateMetadata` for titles. No raw `<a>` for internal routes, no `<img>` without reason.
- Never import server-only code (secrets, server env) into client components; mark such modules
  with `import 'server-only'`.
- `cacheComponents` is enabled. Request-time data (`cookies()`, `headers()`, `searchParams`,
  uncached fetches) must be read inside a `<Suspense>` boundary or cached with `'use cache'`;
  read `node_modules/next/dist/docs/01-app/01-getting-started/08-caching.md` before caching work.

## Styling

- Use MUI components. Visual design rules (palette, typography, spacing, shape) will be defined
  by the KidzDiary design system; until then do not invent styling conventions.

## Security

- Access tokens in memory only. Never store tokens or personal data in `localStorage`,
  `sessionStorage`, cookies we set, URLs, or logs. Persist only non-sensitive preferences
  (active membership ID, UI settings).
- `NEXT_PUBLIC_*` variables are public. Secrets never get that prefix.
- Never use `dangerouslySetInnerHTML` with untrusted data; React escaping is the default defense.
- Validate and allowlist anything used to build URLs or redirects (e.g. `returnTo` must be a
  same-origin relative path).
- Role checks in the UI are UX only; the API is the authority. Handle 401/403 gracefully.
- Do not log request bodies, tokens, or personal data to the console in committed code.

## Accessibility (WCAG 2.2 AA)

- Semantic elements first (`button`, `nav`, `main`, headings in order). One `h1` per page.
- Every input has a visible label; errors are announced (`aria-describedby`, `role="alert"`).
- Full keyboard operability, visible focus, no keyboard traps; dialogs return focus on close.
- Images have meaningful `alt`, or `alt=""` when decorative.

## Performance

- Keep client bundles small: server-render static content, lazy-load heavy client-only widgets
  with `next/dynamic`, avoid importing whole libraries.
- Avoid request waterfalls; fetch in parallel and prefetch on intent.
- Paginate or virtualize long lists. Respect Core Web Vitals (LCP, INP, CLS): reserve image space,
  avoid layout shift from late-loading content.

## Errors and user feedback

- Every data view handles loading, empty, error, and success states explicitly.
- Show user-safe messages; include the API `requestId` in error details for support, never stack
  traces or raw server messages for 5xx.
- Catch errors at boundaries (`error.tsx`, query error states), not with silent `try/catch` that
  swallows failures.

## Code hygiene

- Small, single-purpose functions; early returns over deep nesting; no dead code or commented-out
  code; no `console.log` left in commits.
- Comments explain _why_, not _what_. Keep `TODO`s rare and specific.
- Text shown to users stays in components/constants, not mixed into logic, so i18n can be added.
- Run `npm run lint`, `npm run typecheck`, `npm run format:check`, tests, and `npm run build`
  before handoff.
