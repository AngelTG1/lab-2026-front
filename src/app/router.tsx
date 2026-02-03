import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from '../shared/components/ProtectedRoute';
import { LoginPage } from '../features/auth/ui/LoginPage';
import { RegisterPage } from '../features/auth/ui/RegisterPage';
import { DashboardPage } from '../features/dashboard/ui/DashboardPage';
import { AdminUsersPage } from '../features/users/ui/AdminUsersPage';
import { AppLayout } from './layouts/AppLayout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { path: 'login', element: <LoginPage />, handle: { hideShell: true } },
      { path: 'register', element: <RegisterPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { index: true, element: <DashboardPage /> },
          {
            path: 'admin',
            element: <ProtectedRoute requireAdmin />,
            children: [{ index: true, element: <AdminUsersPage /> }],
          },
        ],
      },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
