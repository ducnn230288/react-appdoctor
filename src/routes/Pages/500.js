import { P500 } from 'components/Pages';
import { createRoute } from '@/utils/core';
import routerLinks from "@/utils/routerLinks";

const routesConfig = app => ({
  path: routerLinks("Pages500"),
  title: '500',
  component: P500
});

export default app => createRoute(app, routesConfig);
 