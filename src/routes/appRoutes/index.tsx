import { Navigate, type RouteObject } from 'react-router-dom';
import { FORM_SHOWCASE_PATH, USER_CREATE_PATH, USER_EDIT_PATH, USERS_PATH, USERS_ROUTE } from '@/constants/routes';
import { MainLayout } from '@/layouts/MainLayout';
import { FormShowcasePage } from '@/pages/FormShowcase';
import { UsersPage } from '@/pages/Users';
import { UserSavePage } from '@/pages/UserSave';

export const appRoutes: RouteObject[] = [
  {
    element: <MainLayout />,
    children: [
      { index: true, element: <Navigate to={USERS_ROUTE} replace /> },
      { path: USERS_PATH, element: <UsersPage /> },
      { path: USER_CREATE_PATH, element: <UserSavePage /> },
      { path: USER_EDIT_PATH, element: <UserSavePage /> },
      { path: FORM_SHOWCASE_PATH, element: <FormShowcasePage /> },
      { path: '*', element: <Navigate to={USERS_ROUTE} replace /> },
    ],
  },
];
