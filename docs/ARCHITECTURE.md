# Frontend architecture decisions

Decided 2026-10-11. These decisions shape every module; change them only through an explicit
decision recorded here.

| Area              | Decision                                                                   |
| ----------------- | -------------------------------------------------------------------------- |
| Framework         | Next.js 16 App Router, `src/`, TypeScript, Node 24, npm                    |
| UI                | MUI + Emotion (`@mui/material-nextjs` cache provider)                      |
| API access & auth | Same-origin proxy of `/api/v1/*` to k12-api; client-side data fetching     |
| Server state      | TanStack Query                                                             |
| API types         | Generated from k12-api Swagger with `openapi-typescript` + `openapi-fetch` |
| Client state      | Zustand (session, active school/role, UI state only)                       |
| Forms             | React Hook Form + Zod (rules mirror backend DTOs)                          |
| Tenancy           | Central portal + School subdomains                                         |
| Code structure    | Feature modules in `src/modules/<name>/`, thin `app/` routes               |
| Testing           | Vitest + React Testing Library + MSW; Playwright for E2E                   |
| Platform admin    | Same app, separate `/platform` section with its own session                |
| Multi-membership  | Active school + role switcher                                              |
| i18n              | English only, kept i18n-ready (no hard-coded strings in logic)             |
| Local ports       | k12-web `3001`, k12-api `3000`                                             |

## API access and authentication

```text
Browser ──/api/v1/*──▶ Next.js (proxy) ──▶ k12-api
  ├─ access token: memory only (never localStorage/cookies we set)
  ├─ refresh token: HttpOnly cookie set by k12-api, first-party via the proxy
  └─ 401 → one shared refresh request → retry once → else sign out
```

- k12-api returns the access token in JSON and a rotating refresh token in a host-only HttpOnly
  cookie scoped to `/api/v1/auth`. Proxying keeps that cookie on our own origin, so no backend
  change is needed.
- Refresh is single-flight: concurrent 401s share one `/auth/refresh` call, because k12-api treats
  reuse of a rotated refresh token as theft and revokes the session.
- On page load the session is restored by calling `/auth/refresh`.
- `mustChangePassword` credentials can only reach the change-password screen.
- Public pages (tenant branding, public School directory) may render on the server; signed-in
  pages fetch on the client with TanStack Query.
- Route guards are UX only. k12-api enforces every permission.

## Tenancy

- Central portal (e.g. `app.kidzdiary.com`, `localhost:3001`): `POST /auth/login` with School code +
  login ID.
- School hostname (e.g. `dps.kidzdiary.com`, `dps.localhost:3001` in dev): branding from
  `GET /public/tenant`, login with `POST /auth/tenant-login`. The API resolves the School from the
  Host header, so the proxy must forward the original Host (to verify during implementation).
- Every web origin, including School subdomains and custom domains, must be listed in k12-api
  `CORS_ORIGINS`.

## Active school and role

After login, the client loads `GET /auth/me/memberships`. With one membership it is selected
automatically; with several, the user picks one, and a header switcher changes it. The active
membership lives in Zustand (persisted per device) and drives navigation and role-specific pages.

## Code structure

```text
src/
├── app/                 # thin routes: (auth), (app), platform; layouts only
├── modules/<name>/      # mirrors k12-api modules
│   ├── api/             # typed calls + query keys
│   ├── hooks/           # TanStack Query / mutations
│   ├── components/
│   ├── schemas/         # Zod
│   └── index.ts         # the only public import surface
├── components/ui/       # shared MUI-based components
├── lib/api/             # generated types, typed client, refresh handling
├── stores/              # Zustand stores
└── theme/
```

Modules import other modules only through their `index.ts`. Shared code moves to `components/`
or `lib/` only when more than one module needs it.

## Per-module workflow

1. Build or extend the k12-api module (endpoints + Swagger).
2. Regenerate types in k12-web (`npm run api:types`).
3. Add the frontend module: api → hooks → schemas → components → route.
4. Tests: unit/component with MSW; Playwright for the critical flows.

## Known backend follow-ups

- `GET /auth/me/memberships` returns only `schoolId`; the school switcher needs at least the
  School name (and ideally code and logo) in that response.
- Add the k12-web origins (`http://localhost:3001`, subdomain origins) to k12-api `CORS_ORIGINS`.
