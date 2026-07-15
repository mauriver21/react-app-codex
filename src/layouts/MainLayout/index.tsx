import { useState, type MouseEvent } from 'react';
import { Menu } from '@mui/material';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { AppBar } from '@/components/AppBar';
import { Box } from '@/components/Box';
import { Button } from '@/components/Button';
import { Container } from '@/components/Container';
import { H6 } from '@/components/H6';
import { MenuItem } from '@/components/MenuItem';
import { Stack } from '@/components/Stack';
import { Switch } from '@/components/Switch';
import { Toolbar } from '@/components/Toolbar';
import { DARK_THEME_MODE, LIGHT_THEME_MODE } from '@/constants/constants';
import { FORM_SHOWCASE_ROUTE, USERS_ROUTE } from '@/constants/routes';
import type { AppDispatch } from '@/interfaces/AppDispatch';
import type { RootState } from '@/interfaces/RootState';
import { setLanguage, setThemeMode } from '@/states/appState';

export const MainLayout = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { language, themeMode } = useSelector((state: RootState) => state.appState);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const menuOpen = Boolean(menuAnchor);

  const openMenu = (event: MouseEvent<HTMLButtonElement>) => setMenuAnchor(event.currentTarget);
  const closeMenu = () => setMenuAnchor(null);
  const navigateFromMenu = (route: string) => {
    closeMenu();
    navigate(route);
  };

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <H6 component="div" sx={{ flexGrow: 1, fontWeight: 750 }}>
            {t('appName')}
          </H6>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button
              id="demo-navigation-button"
              color="inherit"
              aria-controls={menuOpen ? 'demo-navigation-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={menuOpen ? 'true' : undefined}
              onClick={openMenu}
            >
              {t('navigation.demos')}
            </Button>
            <Menu
              id="demo-navigation-menu"
              anchorEl={menuAnchor}
              open={menuOpen}
              onClose={closeMenu}
              slotProps={{ list: { 'aria-labelledby': 'demo-navigation-button' } }}
            >
              <MenuItem selected={pathname.startsWith(USERS_ROUTE)} onClick={() => navigateFromMenu(USERS_ROUTE)}>
                {t('navigation.usersCrud')}
              </MenuItem>
              <MenuItem
                selected={pathname === FORM_SHOWCASE_ROUTE}
                onClick={() => navigateFromMenu(FORM_SHOWCASE_ROUTE)}
              >
                {t('navigation.formShowcase')}
              </MenuItem>
            </Menu>
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
