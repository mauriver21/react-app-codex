# Scaffold Contract

Use this reference when generating the app structure, provider wiring, and User CRUD implementation.

## Target Shapes

- Standalone app: scaffold in the current directory or a new app directory.
- Monorepo app: scaffold under `packages/web/<app-name>` and keep the app package self-contained.

## Core Stack

- React 19 + TypeScript + Vite
- `react-router-dom`
- `@mui/material` with `@emotion/react` and `@emotion/styled`
- `@reduxjs/toolkit`, `react-redux`, `redux-persist`
- `react-redux-use-model`
- `i18next` and `react-i18next`
- `react-hook-form` and `@hookform/resolvers`
- `yup`
- `msw`

## Formatting

Write a `.prettierrc` file in the app root with the admin app defaults:

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "useTabs": false,
  "trailingComma": "es5",
  "printWidth": 120
}
```

Add Husky formatting support:

- `package.json` should include `prepare: "husky"` and a `lint-staged` block that runs Prettier on staged files.
- Create `.husky/pre-commit` with `pnpm exec lint-staged`.
- Include `husky`, `lint-staged`, and `prettier` in devDependencies.

## Required Source Layout

```text
src/
├── App.tsx
├── main.tsx
├── index.css
├── store.ts
├── api-clients/
│   └── useUserApiClient/
├── components/
│   ├── AppBar/
│   ├── Body1/
│   ├── Body2/
│   ├── Box/
│   ├── Button/
│   ├── Card/
│   ├── Container/
│   ├── Checkbox/
│   ├── FormControl/
│   ├── FormHelperText/
│   ├── FormControlLabel/
│   ├── IconButton/
│   ├── InputAdornment/
│   ├── InputLabel/
│   ├── PasswordField/
│   ├── MenuItem/
│   ├── Select/
│   ├── H1/
│   ├── H2/
│   ├── H3/
│   ├── H4/
│   ├── H5/
│   ├── H6/
│   ├── I18nProvider/
│   ├── SkeletonLoader/
│   ├── Skeleton/
│   ├── Stack/
│   ├── Switch/
│   ├── Table/
│   ├── TableBody/
│   ├── TableCell/
│   ├── TableCellHead/
│   ├── TableContainer/
│   ├── TableHead/
│   ├── TableRow/
│   ├── TextField/
│   ├── Toolbar/
│   ├── Tooltip/
│   ├── Typography/
│   ├── UserRow/
│   └── ThemeProvider/
├── hocs/
│   └── withSkeleton/
├── interfaces/
│   ├── AppState.ts
│   ├── ThemeMode.ts
│   ├── ThemeName.ts
│   ├── User.ts
│   └── UserSaveFormData.ts
├── form-schemas/
│   └── useUserSaveSchema/
├── constants/
│   ├── constants.ts
│   ├── enums.ts
│   └── urls.ts
├── i18n/
│   └── translations/
│       ├── en/
│       ├── es/
│       └── index.ts
├── layouts/
│   └── MainLayout/
├── mocks/
│   ├── browser.ts
│   ├── data/
│   ├── handlers/
│   └── server.ts
├── models/
│   └── useUserModel/
├── pages/
│   ├── Users/
│   └── UserSave/
├── routes/
│   └── appRoutes/
├── states/
│   └── appState.ts
└── themes/
    └── clarity/
        ├── light.ts
        ├── dark.ts
        └── index.ts
```

## App Bootstrap

Wire the root in this order:

1. Redux `Provider`
2. `PersistGate`
3. `ModelProvider`
4. `I18nProvider`
5. `ThemeProvider`
6. `BrowserRouter`
7. `App`

Register these providers directly in `main.tsx`. Do not generate an `AppSetup` component.

## Routing

- Use `useRoutes` with a `RouteObject[]`.
- Keep the public surface small.
- Route the app around a minimal User CRUD flow:
  - `/` or `/users`
  - `/users/create`
  - `/users/:id`

## User Model

Use `react-redux-use-model` for a typed CRUD model.

Required pieces:

- `User` interface with `id`, `name`, `email`, `roleId`, `status`, and timestamps
- `AppState`, `ThemeMode`, `ThemeName`, and `UserSaveFormData` in `src/interfaces`
- shared app constants like `QueryKey`, `EntityName`, and layout values in `src/constants`
- `useUserApiClient`
- `useUserModel`
- `normalizedEntitiesState` in the root reducer
- redux-persist storage import workaround: `const storage = (storageDefault as any).default || storageDefault;`
- named exports and arrow functions in scaffolded source
- use the current admin-style component wrappers and hook-based field components as the default scaffold style

## Forms

- Put every form schema in `src/form-schemas`.
- Use React Hook Form for User create/edit.
- Keep schema logic outside the page component.
- Prefer `yup` over `zod` in all generated form validation.
- Generate field wrappers that accept `control` and `name` props following the current `TextField` pattern.
- Generate `PasswordField`, `Select`, and `Checkbox` wrappers on top of the `TextField` pattern.

## MSW

Include MSW in the base scaffold:

- `mocks/browser.ts` for the browser worker
- `mocks/server.ts` for the test server
- `mocks/data/users.ts` with seeded users
- `mocks/handlers/userHandler.ts` with list/read/create/update/delete handlers
- `setupTests.ts` to start and reset the Node server
- make the list handler slow enough that the initial table skeleton appears during first load
- run Prettier on staged files through Husky before commits
- keep app/domain types in `src/interfaces`; component prop interfaces stay in their component files

Use in-memory mock data and keep the CRUD handlers aligned with the model layer.

## i18n

- Use `en` and `es`.
- Keep translations namespaced, at minimum `common` and `glossary`.
- Avoid hardcoded UI text in components.

## Theme

- Use the `clarity` theme family.
- Export light and dark variants.
- Default to light mode and allow switching to dark mode.
- Scaffold wrappers for the MUI primitives used by the app, plus `H1` through `H6`, `Body1`, `Body2`, `Skeleton`, `SkeletonLoader`, and `withSkeleton`.

## Acceptance Criteria

- The scaffold compiles without additional app-specific wiring.
- The visible UI is a real User CRUD implementation, not a hello-world placeholder.
- MSW works in browser and tests.
- The theme family includes clarity light and dark.
- All labels, buttons, and headings are localized.
