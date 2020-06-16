import { P403 } from 'components/Pages';
import { createRoute } from '@/utils/core';
import routerLinks from "@/utils/routerLinks";

const routesConfig = app => ({
  path: routerLinks("Pages403"),
  title: '403',
  component: P403
});

export default app => createRoute(app, routesConfig);
 