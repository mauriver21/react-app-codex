import { CssBaseline, ThemeProvider as MuiThemeProvider } from '@mui/material';
import type { PropsWithChildren } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { clarityDark, clarityLight } from '@/themes/clarity';

export function ThemeProvider({ children }: PropsWithChildren) {
  const mode = useSelector((state: RootState) => state.appState.themeMode);
  return (
    <MuiThemeProvider theme={mode === 'light' ? clarityLight : clarityDark}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}
