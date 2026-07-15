import {
  AppBar,
  Container,
  IconButton,
  Toolbar,
} from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@/components/Box';
import { Button } from '@/components/Button';
import { H6 } from '@/components/H6';
import { Stack } from '@/components/Stack';
import { setLanguage, setThemeMode } from '@/states/appState';
import type { AppDispatch, RootState } from '@/store';

export const MainLayout = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { language, themeMode } = useSelector((state: RootState) => state.appState);

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <H6 component="div" sx={{ flexGrow: 1, fontWeight: 750 }}>
            {t('appName')}
          </H6>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button color="inherit" onClick={() => navigate('/users')}>
              {t('navigation.users')}
            </Button>
            <Button
              color="inherit"
              size="small"
              onClick={() => dispatch(setLanguage(language === 'en' ? 'es' : 'en'))}
            >
              {t('actions.switchLanguage')}
            </Button>
            <IconButton
              color="inherit"
              aria-label={t('actions.switchTheme')}
              onClick={() => dispatch(setThemeMode(themeMode === 'light' ? 'dark' : 'light'))}
            >
              {themeMode === 'light' ? '◐' : '◑'}
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" component="main" sx={{ py: { xs: 4, md: 7 } }}>
        <Outlet />
      </Container>
    </Box>
  );
};
