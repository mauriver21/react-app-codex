import { createTheme } from '@mui/material/styles';

export const clarityLight = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#315a74' },
    secondary: { main: '#bc5b35' },
    background: { default: '#f4f7f8', paper: '#ffffff' },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, sans-serif',
    h1: { fontSize: '2rem', fontWeight: 700 },
    h2: { fontSize: '1.5rem', fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 650 },
  },
});
