import { CssBaseline, ThemeProvider as MuiThemeProvider } from '@mui/material';
import type { PropsWithChildren } from 'react';
import { useSelector } from 'react-redux';
import { LIGHT_THEME_MODE } from '@/constants/constants';
import type { RootState } from '@/interfaces/RootState';
import { clarityDark, clarityLight } from '@/themes/clarity';

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const mode = useSelector((state: RootState) => state.appState.themeMode);
  return (
    <MuiThemeProvider theme={mode === LIGHT_THEME_MODE ? clarityLight : clarityDark}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};
