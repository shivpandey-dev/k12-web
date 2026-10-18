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

All styling comes from the KidzDiary theme in `src/theme/`. Open `/design-system` in a dev build
to see every token.

- **Colour:** use semantic palette roles, never hex values or raw scales from `tokens/colors.ts`.
  Text: `text.primary` / `text.secondary` / `text.disabled`. Surfaces: `background.default`
  (page), `background.paper` (cards). Lines: `border.subtle` / `border.default` /
  `border.strong`, `divider`. Actions: `primary` (aubergine), `secondary` (rose accent: badges,
  role tags, highlights, never errors). Status: `success`, `warning`, `error`, `info`. Text on a
  filled role uses its `contrastText`; on tints, use the role's `dark` shade.
- **Typography:** `display`, `h1`–`h3`, `title`, `body1` (14px default), `body2` (13px), `label`,
  `caption`, `button`. `h4`–`h6`, `subtitle1/2` and `overline` are disabled. One `h1` per page;
  set `component` when the visual variant differs from the heading level.
- **Spacing:** the unit is 4px, so `sx={{ p: 4 }}` is 16px. Use steps 0.5, 1, 2, 3, 4, 5, 6, 8,
  10, 12, 16.
- **Radius:** the unit is also 4px, so `borderRadius: 2` is 8px (buttons, inputs), `3` is 12px
  (cards, tables), and `4` is 16px (modals, drawers). Named values are in `theme.radius`.
- **Elevation:** use MUI `elevation`/`boxShadow` levels (1 = card, 8 = menu, 24 = modal) or
  `theme.tokenShadows`. The keyboard focus ring is `theme.tokenShadows.focusRing`.
- **Density:** controls default to 36px (`theme.sizes.controlHeight`). Use compact 36px table rows
  on admin screens and comfortable 48px rows on parent and student screens
  (`theme.sizes.rowHeight`).
- **Buttons:** `variant="contained"` = primary, at most one per screen. The default
  `outlined` = secondary (neutral). `text` = tertiary. Use `color="error"` for destructive actions.
  Ripples are off; focus rings show keyboard focus.
- **Fields:** `TextField` / `Select` labels always sit above the field (shrink is forced; never
  pass a floating label). Required fields use `required`; errors use `error` plus `helperText`.
- **Checkbox, radio, switch:** wrap them in `FormControlLabel`. The custom 16px marks come from
  the theme, so don't pass `icon`/`checkedIcon`. `FormControlLabel` and `Select` read their
  children's props, so render them inside a client component.
- **Chips:** filled with a colour role for status and tags (`success` = paid/present, `error` =
  overdue, `warning` = due soon, `secondary` = role tags). Use `variant="outlined"` for filters.
- Shared look-and-feel for a component goes in a `src/theme/components/<component>.ts` override,
  not repeated `sx` on each usage. Add a new token or variant only after asking the user.
- **Light mode only for now:** reading roles through the theme keeps components dark-mode ready.

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
