import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { DEFAULT_LANGUAGE, DEFAULT_THEME_MODE, DEFAULT_THEME_NAME } from '@/constants/constants';
import type { AppState } from '@/interfaces/AppState';

const initialState: AppState = {
  themeName: DEFAULT_THEME_NAME,
  themeMode: DEFAULT_THEME_MODE,
  language: DEFAULT_LANGUAGE,
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
