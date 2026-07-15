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
- `msw`

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
│   ├── AppSetup/
│   ├── Body1/
│   ├── Body2/
│   ├── Box/
│   ├── Button/
│   ├── H1/
│   ├── H2/
│   ├── H3/
│   ├── H4/
│   ├── H5/
│   ├── H6/
│   ├── I18nProvider/
│   ├── Skeleton/
│   ├── Stack/
│   ├── TextField/
│   └── ThemeProvider/
├── interfaces/
│   └── User.ts
├── form-schemas/
│   └── useUserSaveSchema/
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
- `useUserApiClient`
- `useUserModel`
- `normalizedEntitiesState` in the root reducer
- redux-persist storage import workaround: `const storage = (storageDefault as any).default || storageDefault;`
- named exports and arrow functions in scaffolded source

## Forms

- Put every form schema in `src/form-schemas`.
- Use React Hook Form for User create/edit.
- Keep schema logic outside the page component.

## MSW

Include MSW in the base scaffold:

- `mocks/browser.ts` for the browser worker
- `mocks/server.ts` for the test server
- `mocks/data/users.ts` with seeded users
- `mocks/handlers/userHandler.ts` with list/read/create/update/delete handlers
- `setupTests.ts` to start and reset the Node server
- make the list handler slow enough that the initial table skeleton appears during first load

Use in-memory mock data and keep the CRUD handlers aligned with the model layer.

## i18n

- Use `en` and `es`.
- Keep translations namespaced, at minimum `common` and `glossary`.
- Avoid hardcoded UI text in components.

## Theme

- Use the `clarity` theme family.
- Export light and dark variants.
- Default to light mode and allow switching to dark mode.
- Scaffold wrappers for `H1` through `H6`, `Body1`, `Body2`, `Skeleton`, and the basic MUI primitives used by the CRUD screen.

## Acceptance Criteria

- The scaffold compiles without additional app-specific wiring.
- The visible UI is a real User CRUD implementation, not a hello-world placeholder.
- MSW works in browser and tests.
- The theme family includes clarity light and dark.
- All labels, buttons, and headings are localized.
