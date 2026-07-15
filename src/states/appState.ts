import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface AppState {
  themeMode: 'light' | 'dark';
  language: 'en' | 'es';
}

const initialState: AppState = {
  themeMode: 'light',
  language: 'en',
};

const appState = createSlice({
  name: 'appState',
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<AppState['themeMode']>) => {
      state.themeMode = action.payload;
    },
    setLanguage: (state, action: PayloadAction<AppState['language']>) => {
      state.language = action.payload;
    },
  },
});

export const { setLanguage, setThemeMode } = appState.actions;
export const appStateReducer = appState.reducer;
