---
name: api-integration
description: Integrate k12-web with the k12-api backend. Use whenever code calls an API endpoint, adds or changes query/mutation hooks, regenerates OpenAPI types, handles API errors or pagination, or touches authentication, token refresh, tenancy, or the active school/role context.
---

# API Integration

## Contract

- k12-api is the source of truth. Types are generated from its Swagger spec with
  `openapi-typescript` (`npm run api:types`) and called through the shared `openapi-fetch` client
  in `src/lib/api/`. Never hand-write a DTO type that the spec already describes.
- When the backend contract changes, regenerate types first and let the compiler find breakages.
- Requests go to the same-origin `/api/v1/*` path, which Next.js forwards to k12-api. Do not call
  the API host directly from the browser.

## Calls and caching

- Each module has an `api/` file with plain typed functions and a query-key factory:

  ```ts
  export const studentKeys = {
    all: ['students'] as const,
    list: (schoolId: string, query: StudentQuery) =>
      [...studentKeys.all, 'list', schoolId, query] as const,
    detail: (schoolId: string, id: string) => [...studentKeys.all, 'detail', schoolId, id] as const,
  };
  ```

- Hooks in `hooks/` wrap `useQuery`/`useMutation`. Components never call `fetch` or the client
  directly.
- Query keys include every input that changes the result, including `schoolId` (tenant) and
  pagination/filter params. Tenant data must never be served from another school's cache entry.
- After a mutation, invalidate or update exactly the affected keys. Use optimistic updates only
  when rollback is implemented.
- Paginated endpoints return `{ data, meta: { page, limit, total, totalPages } }`; keep page/limit
  in URL search params and use `placeholderData: keepPreviousData` for smooth paging.
- Pass the query `signal` to the client so cancelled queries abort the request.

## Auth and session

- The access token is kept in memory only. The refresh token is an HttpOnly cookie owned by
  k12-api; JavaScript never reads it.
- On 401 the client performs one shared (single-flight) `POST /auth/refresh`, then retries the
  original request once. Concurrent refreshes are forbidden: the API revokes the session on reuse
  of a rotated refresh token. A failed refresh clears the session and the query cache.
- Restore the session on load via `/auth/refresh`. A credential with `mustChangePassword` may only
  use the change-password flow.
- Logout calls the API, then always clears local state and `queryClient.clear()` even if the call
  fails.
- Platform-admin sessions (`/platform`) use their own token and client instance; never mix them
  with school-user sessions.

## Tenancy and roles

- Central portal login sends School code + login ID (`/auth/login`); on a School hostname use
  `/auth/tenant-login` and branding from `/public/tenant`.
- The active school/role comes from the Zustand store fed by `/auth/me/memberships`. School-scoped
  calls take `schoolId` from that store, never from user-editable input.
- Hiding UI by role is UX only; always handle 403 from the API.

## Errors

- Errors follow `{ statusCode, error, message, path, requestId, timestamp }`; `message` may be a
  string or a string array. Normalize into one `ApiError` type in `src/lib/api/`.
- Do not retry 4xx. Map 400 validation messages to form fields where possible, 401 → session flow,
  403 → "no access" state, 404 → not-found UI, 409 → conflict message, 429 → "try again later",
  5xx/network → generic message with `requestId`.
- Never log tokens, auth headers, or request bodies with personal data.

## Checks

- Types regenerated and compile; no `any` or casts around API responses.
- Keys include tenant and params; mutations invalidate the right keys.
- Loading, empty, error, and 403 states handled; tests use MSW handlers matching the contract.
