---
name: react-scaffold-app
description: Scaffold a minimal TypeScript React app that follows the current packages/web/admin conventions, including i18n, React Router, MUI clarity light and dark themes, Redux plus react-redux-use-model, React Hook Form, a CRUD-ready User model layer, and MSW for browser and test mocks. Use when creating a new standalone React app or a new packages/web workspace package from the current admin-style scaffold.
---

# React Scaffold App

Create a compact React application scaffold that starts with a real User CRUD experience and the same foundation used by the current admin package.

## Workflow

1. Inspect the destination and decide whether to scaffold a standalone app or a `packages/web/<name>` workspace package.
2. Prefer `pnpm` unless the user already chose another package manager.
3. Match the current admin app conventions:
   - Vite + React + TypeScript
   - `@/*` path aliases
   - `react-redux-use-model` with `normalizedEntitiesState`
   - Redux persist storage workaround for CommonJS/ESM interop
   - `i18next` and `react-i18next`
   - React Router object routes
   - MUI `clarity` light and dark themes
   - React Hook Form with form schemas in `src/form-schemas`
   - MSW browser and Node mocks
   - arrow functions and named exports in generated source files
4. Build the source tree described in [references/scaffold-contract.md](references/scaffold-contract.md).
5. Keep the UI minimal and CRUD-oriented:
   - user list
   - user form for create and edit
   - delete action
   - a small shell around the CRUD area
6. Put every visible string in i18n catalogs.
7. Validate the generated app by building it and smoke-testing the mocked User flow.

## Required Outputs

- `main.tsx` provider stack
- `store.ts` and model wiring
- `src/i18n/translations/en` and `src/i18n/translations/es`
- `src/themes/clarity/light.ts` and `src/themes/clarity/dark.ts`
- `src/api-clients/useUserApiClient`
- `src/models/useUserModel`
- `src/form-schemas/useUserSaveSchema`
- `src/mocks/browser.ts`, `src/mocks/server.ts`, `src/mocks/handlers`, and `src/mocks/data`
- `src/components/H1` through `src/components/H6`
- `src/components/Body1` and `src/components/Body2`
- `src/components/Skeleton`
- CRUD routes and pages

## Guardrails

- Do not add admin-only pages, dashboards, or unrelated domain models.
- Do not add Storybook or extra infrastructure unless the target repo already requires it.
- Do not hardcode theme names or translation strings in components.
- Use `clarity` as the default theme family for the scaffold.
- Keep the User list mock slow enough for the initial skeleton state to render.
