import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { normalizedEntitiesState } from "react-redux-use-model";
import { persistReducer, persistStore } from "redux-persist";
import storageDefault from "redux-persist/lib/storage";
import { appStateReducer } from "@/states/appState";

// redux-persist exposes storage differently across CommonJS and ESM builds.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const storage = (storageDefault as any).default || storageDefault;

const persistedAppState = persistReducer(
  { key: "appState", storage },
  appStateReducer,
);

export const rootReducer = combineReducers({
  normalizedEntitiesState,
  appState: persistedAppState,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
