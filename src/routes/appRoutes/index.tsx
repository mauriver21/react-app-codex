import { Navigate, type RouteObject } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { UsersPage } from '@/pages/Users';
import { UserSavePage } from '@/pages/UserSave';

export const appRoutes: RouteObject[] = [
  {
    element: <MainLayout />,
    children: [
      { index: true, element: <Navigate to="/users" replace /> },
      { path: 'users', element: <UsersPage /> },
      { path: 'users/create', element: <UserSavePage /> },
      { path: 'users/:id', element: <UserSavePage /> },
      { path: '*', element: <Navigate to="/users" replace /> },
    ],
  },
];
