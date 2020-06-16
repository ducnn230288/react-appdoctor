import { P404 } from 'components/Pages';
import { createRoute } from '@/utils/core';
import routerLinks from "@/utils/routerLinks";

const routesConfig = (app) => ({
  path: routerLinks("Pages404"),
  title: 'Page not found',
  component: P404,
});

export default (app) => createRoute(app, routesConfig);
