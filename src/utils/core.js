import React from 'react';
import { dynamic, router } from 'dva';
import $$ from 'cmn-utils';
import config from '@/config';
const { Route, Switch, Redirect } = router;

/**
 * Generate dynamic components
 * @param {*} app
 * @param {*} models
 * @param {*} component
 */
export const dynamicWrapper = (app, models, component) =>
  dynamic({
    app,
    models: () => models,
    component
  });

/**
 * Generate a set of routes
 * @param {*} app
 * @param {*} routesConfig
 */
export const createRoutes = (app, routesConfig) => {
  const routes = routesConfig(app)
    .map(config => createRoute(app, () => config))
    .reduce((p, n) => {
      if (n.length) {
        return [...p, ...n];
      } else {
        return p.concat(n);
      }
    }, []);
  return <Switch>{routes}</Switch>;
};
// Route map
window.dva_router_pathMap = {};
/**
 * Generate a single route
 * @param {*} app
 * @param {*} routesConfig
 */
export const createRoute = (app, routesConfig) => {
  const {
    component: Comp,
    path,
    indexRoute,
    title,
    exact,
    ...otherProps
  } = routesConfig(app);

  if (path && path !== '/') {
    window.dva_router_pathMap[path] = { path, title, ...otherProps };
    // Add parentPath to child route
    if (otherProps.childRoutes && otherProps.childRoutes.length) {
      otherProps.childRoutes.forEach(item => {
        if (window.dva_router_pathMap[item.key]) {
          window.dva_router_pathMap[item.key].parentPath = path;
        }
      });
    }
  }

  // Put Redirect first
  if (indexRoute && $$.isArray(otherProps.childRoutes)) {
    otherProps.childRoutes.unshift(
      <Redirect key={path + '_redirect'} exact from={path} to={indexRoute} />
    );
  }

  const routeProps = {
    key: path || $$.randomStr(4),
    render: props => {
      // Here you can do routing authority judgment
      setDocumentTitle(title);
      return <Comp routerData={otherProps} {...props} />
    }
  };

  return <Route path={path} exact={!!exact} {...routeProps} />;
};

/**
 * Set page title
 * @param {*} title 
 */
function setDocumentTitle(title) {
  const documentTitle = config.htmlTitle ? config.htmlTitle.replace(/{.*}/gi, title) : title
  if (documentTitle !== document.title) {
    document.title = documentTitle;
  }
}
