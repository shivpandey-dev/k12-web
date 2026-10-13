---
name: create-frontend-module
description: Create a cohesive feature module in the k12-web Next.js frontend that mirrors a k12-api backend module. Use when adding a new feature area (e.g. students, attendance, fees) or a new module under src/modules, including its API calls, query hooks, schemas, components, routes, navigation, and tests.
---

# Create Frontend Module

## Workflow

1. Read `AGENTS.md`, `docs/ARCHITECTURE.md`, and neighboring modules. Open the matching k12-api
   module and its Swagger contract; confirm the endpoints exist and are stable. If a needed
   endpoint is missing, stop and raise it as a backend task instead of faking it.
2. Regenerate API types (`npm run api:types`) so the module builds on the current contract.
3. State a short plan: routes, roles that see it, endpoints used, components, and out-of-scope items.
4. Create only the folders the module needs:

   ```text
   src/modules/<module>/
   ├── api/          # typed calls + query-key factory (<module>-api.ts, <module>-keys.ts)
   ├── hooks/        # useQuery / useMutation wrappers (use-<thing>.ts)
   ├── schemas/      # Zod form schemas mirroring backend DTOs
   ├── components/   # module UI
   └── index.ts      # the only public surface
   ```

5. Add thin route files under `src/app/` that render module components, plus `loading.tsx` and
   `error.tsx` where the segment fetches data. Register navigation entries with the roles allowed
   to see them.
6. Export from `index.ts` only what other code needs (components used by routes, hooks or types
   another module consumes). Never deep-import another module's internals. Test helpers other
   modules' tests need (e.g. seeding state) go in `testing.ts`, which only test files may import.
7. Follow the `api-integration`, `ui-component`, and `form` skills for the respective parts.
8. Add tests per `frontend-testing`: hook/API behavior with MSW, components for key states, and an
   E2E flow for the module's critical path.
9. Run lint, typecheck, tests, and build.

## Guardrails

- One module per backend capability; do not create a module for a single shared widget
  (put that in `src/components/`).
- No circular imports between modules. If two modules need each other, extract the shared piece
  or depend in one direction through `index.ts`.
- Do not move code to shared folders until two modules actually need it.
- Do not create empty folders or placeholder files for appearances.
- Summarize routes, exports, endpoints consumed, tests, and any backend follow-ups.
