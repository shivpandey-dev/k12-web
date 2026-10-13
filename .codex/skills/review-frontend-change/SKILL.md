---
name: review-frontend-change
description: Perform the final engineering review of substantive k12-web frontend changes. Use before completing or handing off generated frontend code, especially changes involving routes, server/client boundaries, API integration, auth/session, forms, accessibility, security, performance, or tests.
---

# Review Frontend Change

## Review sequence

1. Read the request, `AGENTS.md`, `docs/ARCHITECTURE.md`, affected modules, and the full diff.
   Identify changed routes, module exports, API contracts consumed, dependencies, and config.
2. Correctness: all states (loading, empty, error, success, 403), edge cases, race conditions
   (stale responses, double submit, unmount during request), cache invalidation, and navigation
   after mutations.
3. Architecture: thin `app/` routes, module boundaries through `index.ts`, no circular imports,
   Server Components by default with minimal `'use client'`, no server data copied into Zustand,
   no new dependency without justification.
4. API integration: generated types used, no hand-copied DTOs, query keys include tenant and params,
   single-flight refresh preserved, errors mapped per `api-integration`.
5. Security: tokens memory-only, no secrets in `NEXT_PUBLIC_*`, no unsafe HTML, validated
   redirects/URLs, no sensitive data in logs or URLs, role-hiding not treated as authorization.
6. Accessibility (WCAG 2.2 AA): semantics, labels, keyboard path, focus management, announced
   errors.
7. Performance: client bundle impact, waterfalls, unnecessary re-renders, image/font handling,
   layout shift, unbounded lists.
8. Code quality: naming and kebab-case files, TypeScript strictness (no `any`, unjustified casts,
   or ignores), dead code, `console.log`, user-facing text kept i18n-friendly.
9. Tests: meaningful behavior coverage including failure paths; MSW handlers match the contract.
10. Run `npm run lint`, `npm run typecheck`, `npm run format:check`, tests, and `npm run build`. Fix
    problems in scope; do not weaken checks or delete tests.

## Handoff

Prioritize findings by user/production impact with exact file and line references. If nothing
actionable remains, say so and list residual risks or checks that could not run. Summarize routes,
contracts consumed, backend follow-ups, commands executed, and trade-offs without claiming unrun
checks.
