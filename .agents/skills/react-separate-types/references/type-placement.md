# Type Placement

Use this reference when deciding where a type belongs in a React codebase.

## Dedicated Files

Create a dedicated file when a type is:

- shared across multiple components
- used by a page, hook, schema, store, or API client
- part of app state, form data, API payloads, or DTOs

Examples:

- `User`
- `UserSaveFormData`
- `AppState`
- `ThemeMode`
- `ThemeName`

## Component Props

Keep prop interfaces local when they are only used by one component.

Examples:

- `TextFieldProps`
- `PasswordFieldProps`
- `SelectProps`
- `CheckboxProps`

## Naming

- Use `src/interfaces/<Name>.ts` for shared app types.
- Use `interface` for object-shaped public contracts.
- Use `type` for unions, aliases, and simple derived types.

## Anti-Patterns

- Inline app state types inside slices or hooks
- Inline form value types inside pages
- Catch-all `types.ts` files with unrelated exports
- Moving component prop interfaces into `src/interfaces` when they are only used once
