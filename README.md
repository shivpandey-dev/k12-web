# k12-web

Next.js frontend for KidzDiary, built module by module alongside [`k12-api`](../k12-api).

## Technology

- Node.js 24 LTS, npm 11
- Next.js 16 (App Router, `src/` directory, Turbopack), React 19, TypeScript
- MUI (Material UI) with Emotion via `@mui/material-nextjs`
- ESLint (`eslint-config-next`) + Prettier

## Setup

```bash
nvm use
npm install
cp .env.example .env.local
npm run dev
```

The app runs at http://localhost:3001; k12-api runs on port 3000. Browser calls to `/api/v1/*` are
proxied to `K12_API_ORIGIN`, so k12-api needs `http://localhost:3001` in `CORS_ORIGINS` and
`TRUST_PROXY_HOPS=1`.

## Commands

| Command                | Purpose                                                               |
| ---------------------- | --------------------------------------------------------------------- |
| `npm run dev`          | Start the dev server                                                  |
| `npm run build`        | Production build                                                      |
| `npm run start`        | Serve the production build                                            |
| `npm run lint`         | ESLint                                                                |
| `npm run typecheck`    | TypeScript check                                                      |
| `npm run format`       | Format with Prettier                                                  |
| `npm run format:check` | Verify formatting                                                     |
| `npm test`             | Unit and component tests (Vitest + MSW)                               |
| `npm run api:types`    | Regenerate `src/lib/api/schema.d.ts` from the running k12-api Swagger |

## Structure

```text
src/
├── app/              # App Router routes, root layout, client providers
├── lib/api/          # generated k12-api types, typed client, token refresh, ApiError
├── lib/query-client.ts
├── modules/auth/     # session store, auth API calls, login/logout/password hooks
├── test/             # Vitest setup, MSW server and fixtures
└── theme/            # MUI theme and the client-side ThemeRegistry (Emotion SSR cache)
```

The theme in `src/theme/theme.ts` is a placeholder until the theme step.

Architecture decisions (API access, state, tenancy, structure, testing) are in
[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).
