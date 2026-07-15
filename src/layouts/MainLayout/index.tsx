import { Outlet, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { AppBar } from '@/components/AppBar';
import { Box } from '@/components/Box';
import { Button } from '@/components/Button';
import { Container } from '@/components/Container';
import { H6 } from '@/components/H6';
import { Stack } from '@/components/Stack';
import { Switch } from '@/components/Switch';
import { Toolbar } from '@/components/Toolbar';
import { DARK_THEME_MODE, LIGHT_THEME_MODE } from '@/constants/constants';
import { USERS_ROUTE } from '@/constants/routes';
import type { AppDispatch } from '@/interfaces/AppDispatch';
import type { RootState } from '@/interfaces/RootState';
import { setLanguage, setThemeMode } from '@/states/appState';

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
            <Button color="inherit" onClick={() => navigate(USERS_ROUTE)}>
              {t('navigation.users')}
            </Button>
            <Button color="inherit" size="small" onClick={() => dispatch(setLanguage(language === 'en' ? 'es' : 'en'))}>
              {t('actions.switchLanguage')}
            </Button>
            <Switch
              checked={themeMode === DARK_THEME_MODE}
              slotProps={{ input: { 'aria-label': t('actions.switchTheme') } }}
              onClick={() =>
                dispatch(setThemeMode(themeMode === LIGHT_THEME_MODE ? DARK_THEME_MODE : LIGHT_THEME_MODE))
              }
            />
          </Stack>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" component="main" sx={{ py: { xs: 4, md: 7 } }}>
        <Outlet />
      </Container>
    </Box>
  );
};
