import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Blog from './pages/Blog';
import User from './pages/User';
import Login from './pages/Login';
import NotFound from './pages/Page404';
import Register from './pages/Register';
import Products from './pages/Products';
import DashboardApp from './pages/DashboardApp';
import ServiceProvider from './pages/ServiceProvider';

// ----------------------------------------------------------------------

export default function Router({ loggedIn }) {
  return useRoutes([
    {
      path: '/dashboard',
      element: loggedIn ? <DashboardLayout /> : <Navigate to="/login" />,
      children: [
        { path: 'app', element: <DashboardApp /> },
        { path: 'serviceprovider', element: <ServiceProvider /> },
        { path: 'user', element: <User /> },
        { path: 'products', element: <Products /> },
        { path: 'blog', element: <Blog /> },
      ],
    },
    {
      path: '/',
      element: !loggedIn ? <LogoOnlyLayout /> : <Navigate to="/dashboard/app" />,
      children: [
        { path: '/login', element: <Login /> },
        { path: '/', element: <Navigate to="/dashboard/app" /> },
        { path: 'register', element: <Register /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
