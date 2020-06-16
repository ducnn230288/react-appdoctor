import { dynamicWrapper, createRoute } from '@/utils/core';
import routerLinks from "@/utils/routerLinks";

const routesConfig = (app) => ({
  path: routerLinks("Login"),
  title: 'Login',
  component: dynamicWrapper(app, [import('./model')], () => import('./components'))
});

export default (app) => createRoute(app, routesConfig);
