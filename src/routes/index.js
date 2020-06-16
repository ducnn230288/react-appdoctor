import { createRoutes } from '@/utils/core';
import BasicLayout from '@/layouts/BasicLayout';
import UserLayout from '@/layouts/UserLayout';
import routerLinks from "@/utils/routerLinks";

import Login from './Auth/Login';
import Register from './Auth/Register';

import Page403 from './Pages/403';
import NotFound from './Pages/404';
import Page500 from './Pages/500';

import Dashboard from './Admin/Dashboard';
import Purchase from './Admin/Purchase';

const routesConfig = app => [
  {
    path: '/auth',
    title: 'Login',
    indexRoute: routerLinks("Login"),
    component: UserLayout,
    childRoutes: [
      Login(app),
      Register(app),
      NotFound()
    ]
  },
  {
    path: '/',
    title: 'System Center',
    component: BasicLayout,
    indexRoute: routerLinks('Dashboard'),
    childRoutes: [
      // 💬 generate admin to here
      Purchase(app),
      Dashboard(app),
      Page403(),
      Page500(),
      NotFound()
    ]
  },
  // {
  //   path: '/',
  //   title: 'Frontend',
  //   indexRoute: routerLinks('Home'),
  //   component: FrontendLayout,
  //   childRoutes: [
  //     // 💬 generate frontend to here
  //     Home(app),
  //     NotFound(),
  //   ]
  // },
];

export default app => createRoutes(app, routesConfig);
