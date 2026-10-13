---
name: form
description: Build forms in k12-web with React Hook Form, Zod, and MUI. Use for any form, user input, validation rule, or user-submitted mutation (login, create/edit screens, filters with submit), including mapping k12-api validation errors back to fields.
---

# Form

## Schema

- Define one Zod schema per form in `src/modules/<module>/schemas/<form-name>-schema.ts` and derive
  the form type with `z.infer`. Mirror the backend DTO rules (required, length, pattern, enums)
  from the generated types/Swagger so users get errors before submitting. The backend stays
  authoritative; never drop server validation handling because the client validates.
- Normalize input in the schema (`trim()`, case) consistently with the backend transformers.
- Cross-field rules use `refine`/`superRefine` with an explicit `path`.
- Messages are short, specific, and tell the user how to fix the problem.

## Wiring

- `useForm({ resolver: zodResolver(schema), defaultValues })` with complete `defaultValues`
  (controlled MUI inputs must never switch from undefined to defined).
- Use `Controller` (or a small shared field wrapper) for MUI inputs: pass `error`, `helperText`,
  `inputRef`, `name`, `value`, `onChange`, `onBlur`.
- Validation mode: `onSubmit` first, then `reValidateMode: 'onChange'`.
- Submit through a TanStack Query mutation hook; disable the submit button and show progress while
  pending; prevent double submission.
- Set correct `type` and `autoComplete` (`username`, `current-password`, `new-password`, `email`,
  `tel`) and `inputMode` for mobile keyboards.

## Server errors

- 400 with a `message` array: map messages to fields where the field is identifiable
  (`setError`), show the rest in a form-level alert.
- 401 on login: one generic message (never reveal which field was wrong). 409: explain the conflict
  on the relevant field. 429: ask the user to wait. 5xx/network: generic message with `requestId`.
- Keep user input on failure; never clear the form on an error. Clear password fields after a
  failed login only if the product requires it.

## Accessibility

- Every field has a visible `label`; required fields marked in text, not only with color or `*`.
- Error text linked via `aria-describedby` (MUI `helperText` does this) and the form-level error
  uses `role="alert"`. Move focus to the first invalid field on failed submit (RHF does by
  default with `shouldFocusError`).
- Group related controls with `fieldset`/`legend` (radio groups, checkbox groups).

## Checks

- Schema unit tests for edge cases (boundaries, patterns, refinements).
- Component tests: validation messages, successful submit payload, server error mapping, pending
  state. Use MSW for API responses.
