import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { I18nProvider } from '@/components/I18nProvider';
import { FORM_SHOWCASE_PATH, USERS_PATH, USERS_ROUTE } from '@/constants/routes';
import { MainLayout } from '@/layouts/MainLayout';
import { store } from '@/store';

const renderLayout = () =>
  render(
    <Provider store={store}>
      <I18nProvider>
        <MemoryRouter initialEntries={[USERS_ROUTE]}>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path={USERS_PATH} element={<div>Users page content</div>} />
              <Route path={FORM_SHOWCASE_PATH} element={<div>Showcase page content</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </I18nProvider>
    </Provider>
  );

describe('MainLayout', () => {
  it('navigates between the users CRUD and form showcase from the demos menu', async () => {
    const user = userEvent.setup();
    renderLayout();

    await user.click(screen.getByRole('button', { name: 'Demos' }));
    await user.click(screen.getByRole('menuitem', { name: 'Form showcase' }));
    expect(screen.getByText('Showcase page content')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Demos' }));
    await user.click(screen.getByRole('menuitem', { name: 'Users CRUD' }));
    expect(screen.getByText('Users page content')).toBeInTheDocument();
  });
});
