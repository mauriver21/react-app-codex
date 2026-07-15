import { createTheme } from '@mui/material/styles';

export const clarityDark = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#84b7d4' },
    secondary: { main: '#ef9a75' },
    background: { default: '#10191f', paper: '#18252d' },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, sans-serif',
    h1: { fontSize: '2rem', fontWeight: 700 },
    h2: { fontSize: '1.5rem', fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 650 },
  },
});
