#!/usr/bin/env python3
"""Scaffold a minimal React app with User CRUD, clarity themes, and MSW."""

from __future__ import annotations

import argparse
import json
import re
import shutil
from pathlib import Path
from textwrap import dedent


PACKAGE_JSON = {
    "name": "__APP_NAME__",
    "private": True,
    "version": "0.0.0",
    "type": "module",
    "scripts": {
        "dev": "vite",
        "build": "tsc -b && vite build",
        "preview": "vite preview",
        "test": "vitest",
    },
    "dependencies": {
        "@emotion/react": "^11.14.0",
        "@emotion/styled": "^11.14.1",
        "@hookform/resolvers": "^5.4.0",
        "@mui/material": "^9.2.0",
        "@reduxjs/toolkit": "^2.12.0",
        "i18next": "^26.3.4",
        "react": "^19.2.7",
        "react-dom": "^19.2.7",
        "react-hook-form": "^7.80.0",
        "react-i18next": "^17.0.8",
        "react-redux": "^9.3.0",
        "react-redux-use-model": "0.0.40-alpha",
        "react-router-dom": "^7.18.1",
        "redux-persist": "^6.0.0",
        "yup": "^1.7.1",
    },
    "devDependencies": {
        "@testing-library/jest-dom": "^6.9.1",
        "@testing-library/react": "^16.3.2",
        "@testing-library/user-event": "^14.6.1",
        "@types/node": "^24.13.2",
        "@types/react": "^19.2.17",
        "@types/react-dom": "^19.2.3",
        "@vitejs/plugin-react": "^6.0.3",
        "dotenv": "^17.4.2",
        "jsdom": "^29.1.1",
        "msw": "^2.14.6",
        "typescript": "~6.0.2",
        "vite": "^8.1.3",
        "vite-plugin-checker": "^0.14.4",
        "vite-plugin-environment": "^1.1.3",
        "vite-tsconfig-paths": "^6.1.1",
        "vitest": "^4.1.9",
    },
}


def package_name(value: str) -> str:
    normalized = re.sub(r"[^a-z0-9-]+", "-", value.lower()).strip("-")
    if not normalized:
        raise argparse.ArgumentTypeError("package name must contain a letter or digit")
    return normalized


def write(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(dedent(content).strip() + "\n", encoding="utf-8")


def component_passthrough(component: str, source: str, props_type: str | None = None) -> str:
    props_line = f"export interface {component}Props extends {props_type} {{}}" if props_type else f"export interface {component}Props {{}}"
    return f"""
import {{ {source} as Mui{source}, {source}Props as Mui{source}Props }} from '@mui/material';

{props_line}

export const {component} = (props: {component}Props) => <Mui{source} {{...props}} />;
"""


def typography_wrapper(component: str, variant: str) -> str:
    return f"""
import {{ Typography, TypographyProps }} from '@mui/material';

export interface {component}Props extends TypographyProps {{}}

export const {component} = (props: {component}Props) => <Typography variant="{variant}" {{...props}} />;
"""


def scaffold(root: Path, name: str, layout: str) -> None:
    app_dir = root if layout == "single" else root / "packages" / "web" / name
    if layout == "single" and root.exists() and any(root.iterdir()):
        raise SystemExit(f"destination is not empty: {root}")
    if layout == "monorepo":
        app_dir.mkdir(parents=True, exist_ok=True)
    else:
        app_dir.mkdir(parents=True, exist_ok=True)

    if layout == "monorepo" and not (root / "package.json").exists():
        write(
            root / "package.json",
            json.dumps(
                {
                    "name": package_name(root.name),
                    "private": True,
                    "version": "1.0.0",
                    "packageManager": "pnpm@10.6.5",
                    "scripts": {
                        "dev": f"pnpm --filter {name} dev",
                        "build": f"pnpm --filter {name} build",
                        "test": f"pnpm --filter {name} test",
                    },
                },
                indent=2,
            ),
        )
        write(root / "pnpm-workspace.yaml", "packages:\n  - 'packages/*/*'\n")

    write(
        app_dir / "package.json",
        json.dumps({**PACKAGE_JSON, "name": name}, indent=2),
    )
    write(
        app_dir / "tsconfig.json",
        """
        {
          "extends": "./tsconfig.app.json",
          "compilerOptions": {
            "composite": true
          },
          "references": []
        }
        """,
    )
    write(
        app_dir / "tsconfig.app.json",
        """
        {
          "compilerOptions": {
            "baseUrl": ".",
            "target": "ES2022",
            "useDefineForClassFields": true,
            "lib": ["ES2022", "DOM", "DOM.Iterable"],
            "allowJs": false,
            "skipLibCheck": true,
            "esModuleInterop": true,
            "allowSyntheticDefaultImports": true,
            "strict": true,
            "forceConsistentCasingInFileNames": true,
            "module": "ESNext",
            "moduleResolution": "Bundler",
            "resolveJsonModule": true,
            "isolatedModules": true,
            "noEmit": true,
            "jsx": "react-jsx",
            "paths": {
              "@/*": ["./src/*"]
            }
          },
          "include": ["src"]
        }
        """,
    )
    write(
        app_dir / "vite.config.ts",
        """
        import { defineConfig } from 'vite';
        import react from '@vitejs/plugin-react';
        import tsconfigPaths from 'vite-tsconfig-paths';
        import checker from 'vite-plugin-checker';
        import dotenv from 'dotenv';

        dotenv.config();
        dotenv.config({ path: '.env.dev' });
        dotenv.config({ path: '.env.prod' });

        export default defineConfig({
          plugins: [
            react(),
            tsconfigPaths(),
            checker({
              typescript: true,
              eslint: {
                lintCommand: 'oxlint src',
              },
            }),
          ],
          test: {
            environment: 'jsdom',
            setupFiles: ['./src/setupTests.ts'],
          },
        });
        """,
    )
    write(
        app_dir / "index.html",
        f"""
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>{name}</title>
          </head>
          <body>
            <div id="root"></div>
            <script type="module" src="/src/main.tsx"></script>
          </body>
        </html>
        """,
    )
    write(
        app_dir / ".gitignore",
        """
        node_modules/
        dist/
        coverage/
        .env.dev
        .env.prod
        """,
    )

    src = app_dir / "src"
    write(src / "main.tsx", main_tsx())
    write(src / "App.tsx", app_tsx())
    write(src / "index.css", index_css())
    write(src / "setupTests.ts", setup_tests_ts())
    write(src / "store.ts", store_ts())
    write(src / "states" / "appState.ts", app_state_ts())
    write(src / "models" / "useAppModel" / "index.ts", app_model_ts())
    write(src / "interfaces" / "ThemeMode.ts", "export type ThemeMode = 'light' | 'dark';")
    write(src / "interfaces" / "ThemeName.ts", "export type ThemeName = 'clarity';")
    write(src / "interfaces" / "User.ts", user_interface_ts())
    write(src / "constants" / "urls.ts", "export const API_BASE_URL = '/api';")
    write(src / "api-clients" / "useUserApiClient" / "index.ts", user_api_client_ts())
    write(src / "models" / "useUserModel" / "index.ts", user_model_ts())
    write(src / "form-schemas" / "useUserSaveSchema" / "index.ts", user_schema_ts())
    write(src / "components" / "I18nProvider" / "index.tsx", i18n_provider_ts())
    write(src / "components" / "ThemeProvider" / "index.tsx", theme_provider_ts())
    write(src / "components" / "Skeleton" / "index.tsx", skeleton_ts())
    write(src / "components" / "UsersTableSkeleton" / "index.tsx", users_table_skeleton_ts())
    write(src / "components" / "Box" / "index.tsx", wrapper_ts("Box", "Box"))
    write(src / "components" / "Button" / "index.tsx", wrapper_ts("Button", "Button"))
    write(src / "components" / "Card" / "index.tsx", wrapper_ts("Card", "Card"))
    write(src / "components" / "Stack" / "index.tsx", wrapper_ts("Stack", "Stack"))
    write(src / "components" / "TextField" / "index.tsx", wrapper_ts("TextField", "TextField"))
    write(src / "components" / "H1" / "index.tsx", typography_wrapper("H1", "h1"))
    write(src / "components" / "H2" / "index.tsx", typography_wrapper("H2", "h2"))
    write(src / "components" / "H3" / "index.tsx", typography_wrapper("H3", "h3"))
    write(src / "components" / "H4" / "index.tsx", typography_wrapper("H4", "h4"))
    write(src / "components" / "H5" / "index.tsx", typography_wrapper("H5", "h5"))
    write(src / "components" / "H6" / "index.tsx", typography_wrapper("H6", "h6"))
    write(src / "components" / "Body1" / "index.tsx", typography_wrapper("Body1", "body1"))
    write(src / "components" / "Body2" / "index.tsx", typography_wrapper("Body2", "body2"))
    write(src / "themes" / "clarity" / "light.ts", clarity_theme_ts("light"))
    write(src / "themes" / "clarity" / "dark.ts", clarity_theme_ts("dark"))
    write(src / "themes" / "clarity" / "index.ts", "export { theme as clarityLight } from './light';\nexport { theme as clarityDark } from './dark';")
    write(src / "routes" / "appRoutes" / "index.tsx", routes_ts())
    write(src / "layouts" / "MainLayout" / "index.tsx", main_layout_ts())
    write(src / "pages" / "Users" / "index.tsx", users_page_ts())
    write(src / "pages" / "UserSave" / "index.tsx", user_save_page_ts())
    write(src / "mocks" / "handlers" / "userHandler.ts", user_handler_ts())
    write(src / "mocks" / "handlers" / "index.ts", "export * from './userHandler';")
    write(src / "mocks" / "data" / "users.ts", users_seed_ts())
    write(src / "mocks" / "data" / "index.ts", "export * from './users';")
    write(src / "mocks" / "browser.ts", "import { setupWorker } from 'msw/browser';\nimport * as handlers from './handlers';\n\nexport const worker = setupWorker(...Object.values(handlers).flat());")
    write(src / "mocks" / "server.ts", "import { setupServer } from 'msw/node';\nimport * as handlers from './handlers';\n\nexport const server = setupServer(...Object.values(handlers).flat());")
    write(src / "i18n" / "translations" / "en" / "common.json", common_json("en"))
    write(src / "i18n" / "translations" / "en" / "glossary.json", glossary_json("en"))
    write(src / "i18n" / "translations" / "en" / "index.ts", "export { default as common } from './common.json';\nexport { default as glossary } from './glossary.json';")
    write(src / "i18n" / "translations" / "es" / "common.json", common_json("es"))
    write(src / "i18n" / "translations" / "es" / "glossary.json", glossary_json("es"))
    write(src / "i18n" / "translations" / "es" / "index.ts", "export { default as common } from './common.json';\nexport { default as glossary } from './glossary.json';")
    write(src / "i18n" / "translations" / "index.ts", "export * as en from './en';\nexport * as es from './es';")


def wrapper_ts(component: str, mui_component: str) -> str:
    return f"""
import {{ {mui_component}, {mui_component}Props }} from '@mui/material';

export interface {component}Props extends {mui_component}Props {{}}

export const {component} = (props: {component}Props) => <{mui_component} {{...props}} />;
"""


def main_tsx() -> str:
    return """
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ModelProvider } from 'react-redux-use-model';
import { I18nProvider } from '@/components/I18nProvider';
import { ThemeProvider } from '@/components/ThemeProvider';
import { store, persistor } from '@/store';
import * as resources from '@/i18n/translations';
import { App } from './App';
import './index.css';
import { worker } from './mocks/browser';

if (import.meta.env.MODE === 'development') {
  void worker.start({ onUnhandledRequest: 'bypass' });
}

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ModelProvider store={store as any}>
        <I18nProvider resources={resources}>
          <ThemeProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </ThemeProvider>
        </I18nProvider>
      </ModelProvider>
    </PersistGate>
  </Provider>
);
"""


def app_tsx() -> str:
    return """
import { useRoutes } from 'react-router-dom';
import { appRoutes } from '@/routes/appRoutes';

export const App = () => useRoutes(appRoutes);
"""


def index_css() -> str:
    return """
html, body, #root {
  min-height: 100%;
}

body {
  margin: 0;
  font-family: Inter, system-ui, sans-serif;
  background: #f5f7fb;
}
"""


def setup_tests_ts() -> str:
    return """
import { beforeAll, afterEach, afterAll } from 'vitest';
import { server } from '@/mocks/server';
import '@testing-library/jest-dom';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
"""


def store_ts() -> str:
    return """
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storageDefault from 'redux-persist/lib/storage';
import { normalizedEntitiesState } from 'react-redux-use-model';
import { appStateSlice } from '@/states/appState';

const storage = (storageDefault as any).default || storageDefault;

const rootReducer = combineReducers({
  normalizedEntitiesState,
  appState: appStateSlice.reducer,
});

const persistedReducer = persistReducer(
  {
    key: 'root',
    storage,
    whitelist: ['appState'],
  },
  rootReducer
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
"""


def app_state_ts() -> str:
    return """
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ThemeMode } from '@/interfaces/ThemeMode';
import type { ThemeName } from '@/interfaces/ThemeName';

export interface AppState {
  themeName: ThemeName;
  mode: ThemeMode;
  selectedLang: string;
}

const initialState: AppState = {
  themeName: 'clarity',
  mode: 'light',
  selectedLang: 'en',
};

export const appStateSlice = createSlice({
  name: 'appState',
  initialState,
  reducers: {
    setThemeName: (state, action: PayloadAction<ThemeName>) => {
      state.themeName = action.payload;
    },
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
    },
    setSelectedLang: (state, action: PayloadAction<string>) => {
      state.selectedLang = action.payload;
    },
  },
});
"""


def app_model_ts() -> str:
    return """
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { appStateSlice } from '@/states/appState';
import type { ThemeMode } from '@/interfaces/ThemeMode';
import type { ThemeName } from '@/interfaces/ThemeName';

export const useAppModel = () => {
  const dispatch = useDispatch();
  const actions = appStateSlice.actions;
  const selectAppState = (state: RootState) => state.appState;

  const setThemeName = (themeName: ThemeName) => {
    dispatch(actions.setThemeName(themeName));
  };

  const setThemeMode = (themeMode: ThemeMode) => {
    dispatch(actions.setThemeMode(themeMode));
  };

  const setSelectedLang = (lang: string) => {
    dispatch(actions.setSelectedLang(lang));
  };

  return {
    setThemeName,
    setThemeMode,
    setSelectedLang,
    selectAppState,
  };
};
"""


def user_interface_ts() -> str:
    return """
export interface User {
  id?: string;
  name: string;
  email: string;
  password?: string;
  roleId: number;
  status?: 'active' | 'inactive' | 'invited' | '';
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}
"""


def user_api_client_ts() -> str:
    return """
import type { User } from '@/interfaces/User';
import { API_BASE_URL } from '@/constants/urls';

export interface UserListResponse {
  content: User[];
  pagination: {
    size: number;
    page: number;
    totalElements: number;
    totalPages: number;
  };
}

export const useUserApiClient = () => {
  const list = async ({ _page = 0, _size = 10 }: { _page?: number; _size?: number }) => {
    const response = await fetch(`${API_BASE_URL}/users?_page=${_page}&_size=${_size}`);
    return (await response.json()) as UserListResponse;
  };

  const read = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`);
    return (await response.json()) as User;
  };

  const create = async (payload: User) => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    return (await response.json()) as User;
  };

  const update = async (id: string, payload: User) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    return (await response.json()) as User;
  };

  const remove = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
    });
    return (await response.json()) as User;
  };

  return {
    list,
    read,
    create,
    update,
    remove,
  };
};
"""


def user_model_ts() -> str:
    return """
import { useModel, EntityActionType } from 'react-redux-use-model';
import type { ListQueryHandler, CreateQueryHandler, UpdateQueryHandler, RemoveQueryHandler, ReadQueryHandler } from 'react-redux-use-model';
import type { User } from '@/interfaces/User';
import { useUserApiClient } from '@/api-clients/useUserApiClient';

export const useUserModel = () => {
  const userApiClient = useUserApiClient();

  const model = useModel<
    User,
    {
      list: ListQueryHandler<User>;
      create: CreateQueryHandler<User>;
      update: UpdateQueryHandler<User>;
      read: ReadQueryHandler<User>;
      remove: RemoveQueryHandler<User>;
    }
  >({
    entityName: 'users',
    config: {
      paginationSizeMultiplier: 5,
    },
    handlers: {
      list: {
        apiFn: userApiClient.list,
        action: EntityActionType.LIST,
      },
      read: {
        apiFn: userApiClient.read,
        action: EntityActionType.READ,
      },
      create: {
        apiFn: userApiClient.create,
        action: EntityActionType.CREATE,
      },
      update: {
        apiFn: userApiClient.update,
        action: EntityActionType.UPDATE,
      },
      remove: {
        apiFn: userApiClient.remove,
        action: EntityActionType.REMOVE,
      },
    },
  });

  const save = (data: User) => {
    if (data.id) {
      return model.update(data.id, data);
    }

    return model.create(data);
  };

  return {
    ...model,
    save,
    saveState: {
      isLoading: model.createState.isLoading || model.updateState.isLoading,
    },
  };
};
"""


def user_schema_ts() -> str:
    return """
import * as yup from 'yup';

export const useUserSaveSchema = () =>
  yup.object({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Email is invalid').required('Email is required'),
    roleId: yup.number().required('Role is required'),
    status: yup
      .mixed<'active' | 'inactive' | 'invited'>()
      .oneOf(['active', 'inactive', 'invited'])
      .required('Status is required'),
    password: yup.string().optional(),
  });
"""


def common_json(lang: str) -> str:
    if lang == "es":
        return json.dumps(
            {
                "actions": {
                    "create": "Crear usuario",
                    "edit": "Editar usuario",
                    "delete": "Eliminar",
                    "save": "Guardar",
                    "cancel": "Cancelar",
                },
                "titles": {
                    "users": "Usuarios",
                    "createUser": "Crear usuario",
                    "editUser": "Editar usuario",
                },
                "loading": "Cargando usuarios...",
                "empty": "No hay usuarios todavía.",
            },
            indent=2,
        )

    return json.dumps(
        {
            "actions": {
                "create": "Create user",
                "edit": "Edit user",
                "delete": "Delete",
                "save": "Save",
                "cancel": "Cancel",
            },
            "titles": {
                "users": "Users",
                "createUser": "Create user",
                "editUser": "Edit user",
            },
            "loading": "Loading users...",
            "empty": "No users yet.",
        },
        indent=2,
    )


def glossary_json(lang: str) -> str:
    if lang == "es":
        return json.dumps(
            {
                "fields": {
                    "name": "Nombre",
                    "email": "Correo",
                    "roleId": "Rol",
                    "status": "Estado",
                    "password": "Contraseña",
                },
            },
            indent=2,
        )

    return json.dumps(
        {
            "fields": {
                "name": "Name",
                "email": "Email",
                "roleId": "Role",
                "status": "Status",
                "password": "Password",
            },
        },
        indent=2,
    )


def i18n_provider_ts() -> str:
    return """
import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import { useAppModel } from '@/models/useAppModel';

export const I18nProvider = ({ children, resources }: { children?: React.ReactNode; resources: any }) => {
  const appModel = useAppModel();
  const appState = useSelector(appModel.selectAppState);

  const i18nInstance = useMemo(() => {
    i18n.use(initReactI18next).init({
      resources,
      lng: appState.selectedLang || 'en',
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
    });

    return i18n;
  }, []);

  useEffect(() => {
    if (appState.selectedLang && i18nInstance.language !== appState.selectedLang) {
      void i18nInstance.changeLanguage(appState.selectedLang);
    }
  }, [appState.selectedLang, i18nInstance]);

  return <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>;
};
"""


def theme_provider_ts() -> str:
    return """
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { CssBaseline, ThemeProvider as MuiThemeProvider, capitalize } from '@mui/material';
import { useAppModel } from '@/models/useAppModel';
import * as themes from '@/themes/clarity';

export const ThemeProvider = ({ children }: { children?: React.ReactNode }) => {
  const { selectAppState, setThemeMode, setThemeName } = useAppModel();
  const appState = useSelector(selectAppState);

  const themeName = appState.themeName ?? 'clarity';
  const mode = appState.mode ?? 'light';
  const activeThemeName = `${themeName}${capitalize(mode)}`;
  const currentTheme = (themes as Record<string, any>)[activeThemeName];

  useEffect(() => {
    setThemeName('clarity');
  }, [setThemeName]);

  useEffect(() => {
    if (!appState.mode) {
      setThemeMode('light');
    }
  }, [appState.mode, setThemeMode]);

  return (
    <MuiThemeProvider theme={currentTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};
"""


def clarity_theme_ts(mode: str) -> str:
    palette_mode = "dark" if mode == "dark" else "light"
    return f"""
import {{ createTheme }} from '@mui/material';

export const theme = createTheme({{
  palette: {{
    mode: '{palette_mode}',
    primary: {{
      main: '{'#4f46e5' if mode == 'light' else '#93c5fd'}',
    }},
    background: {{
      default: '{'#f5f7fb' if mode == 'light' else '#0f172a'}',
      paper: '{'#ffffff' if mode == 'light' else '#111827'}',
    }},
  }},
  shape: {{
    borderRadius: 16,
  }},
}});
"""


def routes_ts() -> str:
    return """
import type { RouteObject } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { Users } from '@/pages/Users';
import { UserSave } from '@/pages/UserSave';

export const appRoutes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Users /> },
      { path: 'users', element: <Users /> },
      { path: 'users/create', element: <UserSave /> },
      { path: 'users/:id', element: <UserSave /> },
    ],
  },
];
"""


def main_layout_ts() -> str:
    return """
import { Outlet, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { AppBar, Box, Button, Container, MenuItem, Select, Stack, Switch, Toolbar, Typography } from '@mui/material';
import { useAppModel } from '@/models/useAppModel';

export const MainLayout = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const appModel = useAppModel();
  const appState = useSelector(appModel.selectAppState);
  const isDark = appState.mode === 'dark';

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
          <Typography variant="h6" component="div">
            {t('common:titles.users')}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Select
              size="small"
              value={appState.selectedLang}
              onChange={(event) => appModel.setSelectedLang(event.target.value)}
            >
              <MenuItem value="en">EN</MenuItem>
              <MenuItem value="es">ES</MenuItem>
            </Select>
            <Switch
              checked={isDark}
              onChange={() => appModel.setThemeMode(isDark ? 'light' : 'dark')}
            />
            <Button variant="contained" onClick={() => navigate('/users/create')}>
              {t('common:actions.create')}
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
};
"""


def skeleton_ts() -> str:
    return """
import { Skeleton as MuiSkeleton, SkeletonProps as MuiSkeletonProps } from '@mui/material';

export interface SkeletonProps extends MuiSkeletonProps {
  loading?: boolean;
  fitContent?: boolean;
  hideOnSkeleton?: boolean;
}

export const Skeleton = ({ loading, children, fitContent, hideOnSkeleton = false, sx, ...rest }: React.PropsWithChildren<SkeletonProps>) => {
  if (!loading) {
    return <>{children}</>;
  }

  return (
    <>
      {!hideOnSkeleton ? (
        <MuiSkeleton
          {...rest}
          sx={{
            ...(fitContent ? { maxWidth: '100%', transform: 'none' } : {}),
            ...sx,
          }}
        />
      ) : null}
    </>
  );
};
"""


def users_table_skeleton_ts() -> str:
    return """
import { Stack } from '@/components/Stack';
import { Skeleton } from '@/components/Skeleton';

export const UsersTableSkeleton = () => (
  <Stack spacing={2}>
    <Skeleton loading height={56} />
    <Skeleton loading height={56} />
    <Skeleton loading height={56} />
  </Stack>
);
"""


def users_page_ts() -> str:
    return """
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Button, Card, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { useUserModel } from '@/models/useUserModel';
import { UsersTableSkeleton } from '@/components/UsersTableSkeleton';
import { H1 } from '@/components/H1';
import { Body1 } from '@/components/Body1';
import { Stack } from '@/components/Stack';

export const Users = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const userModel = useUserModel();
  const userPaginatedQuery = useSelector(userModel.selectPaginatedQuery);
  const { paginationParams = { _page: 0, _size: 10 }, ids, initialLoading, listing } = userPaginatedQuery;

  useEffect(() => {
    userModel.list({
      queryKey: 'users-crud',
      paginationParams,
    });
  }, []);

  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <div>
          <H1>{t('common:titles.users')}</H1>
          <Body1>{t('common:loading')}</Body1>
        </div>
        <Button variant="contained" onClick={() => navigate('/users/create')}>
          {t('common:actions.create')}
        </Button>
      </Stack>
      <Card sx={{ p: 2 }}>
        {initialLoading ? (
          <UsersTableSkeleton />
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('glossary:fields.name')}</TableCell>
                <TableCell>{t('glossary:fields.email')}</TableCell>
                <TableCell>{t('glossary:fields.roleId')}</TableCell>
                <TableCell>{t('glossary:fields.status')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ids.map((id) => (
                <TableRow key={id}>
                  <TableCell>{String(id)}</TableCell>
                  <TableCell>{listing ? t('common:loading') : String(id)}</TableCell>
                  <TableCell>1</TableCell>
                  <TableCell>active</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </Stack>
  );
};
"""


def user_save_page_ts() -> str:
    return """
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button, Card, MenuItem } from '@mui/material';
import { useUserModel } from '@/models/useUserModel';
import { useUserSaveSchema } from '@/form-schemas/useUserSaveSchema';
import { TextField } from '@/components/TextField';
import { Stack } from '@/components/Stack';
import { H1 } from '@/components/H1';

const defaultValues = {
  name: '',
  email: '',
  roleId: 1,
  status: 'active' as const,
  password: '',
};

export const UserSave = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const userModel = useUserModel();
  const schema = useUserSaveSchema();
  const isEdit = Boolean(id);
  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });
  const selected = useSelector((state: any) => (id ? userModel.selectEntity(state, id) : { data: undefined }));

  useEffect(() => {
    if (isEdit && id) {
      userModel.read(id);
    }
  }, [id, isEdit]);

  useEffect(() => {
    if (selected?.data) {
      reset(selected.data);
    }
  }, [selected, reset]);

  const onSubmit = async (values: any) => {
    await userModel.save({ ...values, roleId: Number(values.roleId) });
    navigate('/users');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <H1>{isEdit ? 'Edit user' : 'Create user'}</H1>
        <Card sx={{ p: 2 }}>
          <Stack spacing={2}>
            <TextField name="name" control={control} label="Name" />
            <TextField name="email" control={control} label="Email" />
            <TextField name="roleId" control={control} label="Role" select>
              <MenuItem value={1}>Admin</MenuItem>
              <MenuItem value={2}>Editor</MenuItem>
              <MenuItem value={3}>Viewer</MenuItem>
            </TextField>
            <TextField name="status" control={control} label="Status" select>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="invited">Invited</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </TextField>
            <TextField name="password" control={control} label="Password" type="password" />
          </Stack>
        </Card>
        <Stack direction="row" spacing={2}>
          <Button type="submit" variant="contained">
            Save
          </Button>
          <Button variant="outlined" onClick={() => navigate('/users')}>
            Cancel
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};
"""


def users_seed_ts() -> str:
    return """
import type { User } from '@/interfaces/User';

export const users: User[] = Array.from({ length: 24 }, (_, index) => ({
  id: String(index + 1),
  name: `User ${index + 1}`,
  email: `user${index + 1}@example.com`,
  roleId: (index % 3) + 1,
  status: index % 4 === 0 ? 'invited' : 'active',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}));
"""


def user_handler_ts() -> str:
    return """
import { HttpResponse, delay, http } from 'msw';
import type { User } from '@/interfaces/User';
import { API_BASE_URL } from '@/constants/urls';
import { users } from '../data/users';

const pageSize = (value: string | null, fallback: number) => Number(value ?? fallback);

export const userHandler = [
  http.get(`${API_BASE_URL}/users`, async ({ request }) => {
    const url = new URL(request.url);
    const size = pageSize(url.searchParams.get('_size'), 10);
    const page = pageSize(url.searchParams.get('_page'), 0);
    const start = page * size;
    const content = users.slice(start, start + size);
    const totalPages = Math.max(1, Math.ceil(users.length / size));

    await delay(1400);

    return HttpResponse.json(
      {
        content,
        pagination: {
          size,
          page,
          totalElements: users.length,
          totalPages,
        },
      },
      { status: 200 }
    );
  }),
  http.get(`${API_BASE_URL}/users/:id`, async ({ params }) => {
    const user = users.find((item) => item.id === String(params.id));

    await delay(200);

    if (!user) {
      return HttpResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return HttpResponse.json(user, { status: 200 });
  }),
  http.post(`${API_BASE_URL}/users`, async ({ request }) => {
    const payload = (await request.json()) as User;
    const newUser = {
      ...payload,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    users.unshift(newUser);
    await delay(900);

    return HttpResponse.json(newUser, { status: 201 });
  }),
  http.put(`${API_BASE_URL}/users/:id`, async ({ request, params }) => {
    const payload = (await request.json()) as User;
    const id = String(params.id);
    const index = users.findIndex((item) => item.id === id);

    if (index < 0) {
      return HttpResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const updatedUser = {
      ...payload,
      id,
      updatedAt: new Date().toISOString(),
    };

    users[index] = updatedUser;
    await delay(900);

    return HttpResponse.json(updatedUser, { status: 200 });
  }),
  http.delete(`${API_BASE_URL}/users/:id`, async ({ params }) => {
    const id = String(params.id);
    const index = users.findIndex((item) => item.id === id);

    if (index < 0) {
      return HttpResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const [removedUser] = users.splice(index, 1);
    await delay(500);

    return HttpResponse.json(removedUser, { status: 200 });
  }),
];
"""


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("destination", type=Path)
    parser.add_argument("--name", required=True, type=package_name)
    parser.add_argument("--layout", choices=("single", "monorepo"), required=True)
    args = parser.parse_args()

    scaffold(args.destination.resolve(), args.name, args.layout)


if __name__ == "__main__":
    main()
