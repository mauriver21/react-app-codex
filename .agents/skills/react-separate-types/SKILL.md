---
name: react-separate-types
description: Generate React and TypeScript code with domain, form, and state types in dedicated interface files, while keeping only component prop interfaces beside the component. Use when creating or refactoring React code that should move inline app types into src/interfaces or similar dedicated type files.
---

# React Separate Types

Keep component code focused by moving app and domain types into dedicated files.

## Rules

1. Put app, domain, state, form, DTO, and payload types in dedicated files, usually under `src/interfaces/`.
2. Keep component prop interfaces beside the component file when they are only used by that component.
3. Prefer one type concept per file when the type is shared across features.
4. Avoid inline type declarations in pages, hooks, stores, and schemas when the type will be reused.
5. Re-export types only when it improves imports; do not create barrel files unless they reduce noise.

## Common Placement

- `src/interfaces/User.ts`
- `src/interfaces/UserSaveFormData.ts`
- `src/interfaces/AppState.ts`
- `src/interfaces/ThemeMode.ts`
- `src/interfaces/ThemeName.ts`

## Component Exception

Keep these types local to the component file:

- `ButtonProps`
- `TextFieldProps`
- `SelectProps`
- `CheckboxProps`
- other prop interfaces that are only used by one component

## Refactor Checklist

1. Identify inline types used outside a single component.
2. Move the type into a dedicated file.
3. Update imports to use the new file.
4. Leave only component prop interfaces inside component folders.
5. Verify the feature still compiles after the move.
