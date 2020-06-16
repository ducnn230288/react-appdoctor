import { dynamicWrapper, createRoute } from '@/utils/core';
import routerLinks from "@/utils/routerLinks";

const routesConfig = app => ({
  path: routerLinks('Purchase'),
  title: 'Purchase Page',
  component: dynamicWrapper(app, [import('./model')], () => import('./components'))
});

export default app => createRoute(app, routesConfig);
