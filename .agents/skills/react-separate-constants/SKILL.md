---
name: react-separate-constants
description: Keep shared React app constants in dedicated files under src/constants, including query keys, entity names, base URLs, and shared layout values. Use when creating or refactoring React code that should move inline constants into a constants folder while leaving component-local values in the component file.
---

# React Separate Constants

Keep shared constants centralized and easy to import.

## Rules

1. Put shared app constants in `src/constants`.
2. Split constants by concern when they are used in different layers.
3. Use separate files for endpoint URLs, enums, query keys, layout sizes, and other shared values.
4. Keep values that are only used by one component local to that component.
5. Prefer named exports for all constants.

## Common Files

- `src/constants/constants.ts`
- `src/constants/enums.ts`
- `src/constants/urls.ts`

## Typical Contents

- `constants.ts`: shared defaults, sizes, and app-wide scalar values
- `enums.ts`: entity names, query keys, event names, and similar shared enums
- `urls.ts`: base URLs and API endpoints

## Refactor Checklist

1. Identify inline values used across files.
2. Move them into the appropriate file under `src/constants`.
3. Update imports to use the new constant.
4. Remove now-duplicated inline literals.
5. Keep component-specific literals inside the component when they are not shared.
