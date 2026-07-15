# Constant Placement

Use this reference when deciding where a constant belongs in a React codebase.

## Put in `src/constants`

- base URLs
- query keys
- entity names
- app defaults
- shared sizes
- shared event names
- other values used by multiple files

## Keep Local

Keep values in the component or hook when they are:

- only used once
- directly tied to a single UI element
- unlikely to be reused

## Naming

- Use `const` for simple values.
- Use `enum` only when a closed set of named values improves readability.
- Prefer descriptive names like `DEFAULT_LANGUAGE`, `QUERY_KEY_USERS_CRUD`, or `API_BASE_URL`.

## Anti-Patterns

- scattering the same literal across several files
- putting unrelated values in a single `constants.ts` without a clear purpose
- moving one-off UI labels into shared constants instead of i18n
