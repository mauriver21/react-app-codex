import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { normalizedEntitiesState } from "react-redux-use-model";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import appState from "@/states/appState";

const persistedAppState = persistReducer(
  { key: "appState", storage: (storage as any).default },
  appState,
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
