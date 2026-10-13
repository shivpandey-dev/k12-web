---
name: ui-component
description: Build pages, layouts, and UI components in k12-web with MUI. Use when creating or changing any visual component, page layout, navigation, table/list, dialog, or responsive behavior, and to apply server/client component boundaries, WCAG 2.2 AA accessibility, and loading/empty/error state rules.
---

# UI Component

## Placement

- Module-specific UI → `src/modules/<module>/components/`. Reused by two or more modules →
  `src/components/ui/` (generic) or `src/components/` (app-level, e.g. app shell).
- Wrap an MUI component in a shared component only when it adds real project behavior or
  defaults; otherwise use MUI directly.

## Server vs client

- Default to Server Components. Add `'use client'` only for state, effects, event handlers,
  browser APIs, TanStack Query hooks, or Zustand. Keep that client component as small as possible
  and pass server-rendered content in as `children`.
- MUI components work in both; components using `sx` callbacks or hooks need a client boundary.

## Styling

Visual design rules (palette, typography, spacing, shape, modes) will be defined by the KidzDiary
design system. Until then use MUI defaults and do not invent styling conventions.

## Accessibility (WCAG 2.2 AA)

- Prefer MUI components that ship accessible behavior (Dialog, Menu, Tabs, Autocomplete) and keep
  their ARIA wiring intact.
- Icon-only buttons need `aria-label`; decorative icons are `aria-hidden`.
- Visible focus on every interactive element; logical tab order; dialogs trap and restore focus.
- Tables: real `<table>` semantics with headers; announce async updates with `aria-live` when
  they matter.
- Respect `prefers-reduced-motion` for non-essential animation.

## States

Every data-driven component renders four states explicitly:

- Loading: skeletons matching the final layout (avoid layout shift), not blank screens.
- Empty: helpful message and the next action, if the user can take one.
- Error: user-safe message, retry when possible, `requestId` for support.
- Success: the content. Disable and show progress on buttons during mutations.

## Composition

- Keep components presentational where possible: data via props, events via `onX` callbacks;
  hooks live in container components or pages.
- Long lists: paginate (server) or virtualize. Keep tables usable on mobile (card layout or
  horizontal scroll with sticky first column).
- User-facing text stays in the component or a constants file, not built from logic, for future i18n.

## Checks

- Keyboard-only walkthrough works; screen-reader labels make sense.
- Works at mobile and desktop widths.
- Loading/empty/error/success states covered by component tests.
