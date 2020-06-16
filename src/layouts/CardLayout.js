import React from 'react';
import { connect } from 'dva';
import { Layout, Menu } from 'antd';
import { router, routerRedux } from 'dva';
import pathToRegexp from 'path-to-regexp';
import isEqual from 'react-fast-compare';
import $$ from 'cmn-utils';
import cx from 'classnames';
import PropTypes from 'prop-types';
import ElementQueries from 'css-element-queries/src/ElementQueries';

import SkinToolbox from 'components/SkinToolbox';
import routerLinks from "@/utils/routerLinks";

import './styles/card.less';

const { Switch, Link } = router;
const { Content, Header } = Layout;
const SubMenu = Menu.SubMenu;

@connect(({ global }) => ({ global }))
class CardLayout extends React.PureComponent {
  constructor(props) {
    super(props);
    const user = $$.getStore('user', []);
    const theme = $$.getStore('theme', {
      leftSide: 'dark', // left
      navbar: 'light' // top
    });
    if (!theme.layout) {
      theme.layout = [
        'fixedHeader',
        'fixedSidebar',
        'fixedBreadcrumbs'
        // 'hidedBreadcrumbs',
      ];
    }
    this.state = {
      theme, // Skin settings
      user,
      currentMenu: {},
      pathname: null,
      flatMenu: [],
    };

    props.dispatch({
      type: 'global/getMenu'
    });
  }

  componentDidMount() {
    this.checkLoginState();

    ElementQueries.init();
  }

  // Check if a user is logged in
  checkLoginState() {
    const user = $$.getStore('user');
    if (!user) {
      this.props.dispatch(routerRedux.replace(routerLinks("Login")));
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!isEqual(nextProps.location.pathname, prevState.pathname) || !isEqual(nextProps.global.flatMenu, prevState.flatMenu)) {
      return {
        currentMenu: CardLayout.getCurrentMenu(nextProps) || {},
        pathname: nextProps.location.pathname,
        flatMenu: nextProps.global.flatMenu
      };
    }
    return null;
  }

  static getCurrentMenu(props) {
    const {
      location: { pathname },
      global
    } = props;
    const menu = CardLayout.getMeunMatchKeys(global.flatMenu, pathname)[0];
    return menu;
  }

  static getMeunMatchKeys = (flatMenu, path) => {
    return flatMenu.filter(item => {
      return pathToRegexp(item.path).test(path);
    });
  };

  getSubMenuOrItem = item => {
    if (item.children && item.children.some(child => child.name)) {
      const childrenItems = this.getNavMenuItems(item.children);
      if (childrenItems && childrenItems.length > 0) {
        return (
          <SubMenu
            title={
              item.icon ? (
                <span>
                  <i className={item.icon} />
                  <span>{item.name}</span>
                </span>
              ) : (
                item.name
              )
            }
            key={item.path}
          >
            {childrenItems}
          </SubMenu>
        );
      }
      return null;
    } else {
      return (
        <Menu.Item key={item.path}>{this.getMenuItemPath(item)}</Menu.Item>
      );
    }
  };

  /**
   * Judge whether it is http link.return a or Link
   * @memberof SiderMenu
   */
  getMenuItemPath = item => {
    const itemPath = this.conversionPath(item.path);
    const { target, name } = item;
    // Is it a http link
    if (/^https?:\/\//.test(itemPath)) {
      return (
        <a href={itemPath} target={target}>
          <i className={item.icon} />
          <span>{name}</span>
        </a>
      );
    }
    return (
      <Link
        to={itemPath}
        target={target}
        replace={itemPath === this.props.location.pathname}
      >
        <i className={item.icon} />        
        <span>{name}</span>
      </Link>
    );
  };

  /**
   * Get the menu subnode
   */
  getNavMenuItems = menusData => {
    if (!menusData) {
      return [];
    }
    return menusData
      .filter(item => item.name && !item.hideInMenu)
      .map(item => {
        const ItemDom = this.getSubMenuOrItem(item);
        return ItemDom;
      })
      .filter(item => item);
  };

  // conversion Path
  conversionPath = path => {
    if (path && path.indexOf('http') === 0) {
      return path;
    } else {
      return `/${path || ''}`.replace(/\/+/g, '/').replace(/\/:\w+\??/, '');
    }
  };

  // Get the currently selected menu
  getSelectedMenuKeys = () => {
    const {
      location: { pathname },
      global
    } = this.props;

    const selectMenu = CardLayout.getMeunMatchKeys(global.flatMenu, pathname)[0];
    return selectMenu ? [selectMenu.path] : [];
  };

  onChangeTheme = theme => {
    $$.setStore('theme', theme);
    this.setState({
      theme
    });
  };

  render() {
    const { theme } = this.state;
    const { routerData, global } = this.props;
    const { menu } = global;
    const { childRoutes } = routerData;
    const classnames = cx('card-layout', 'full-layout', {
      fixed: theme.layout && theme.layout.indexOf('fixedSidebar') !== -1,
      'fixed-header':
        theme.layout && theme.layout.indexOf('fixedHeader') !== -1,
      'fixed-breadcrumbs':
        theme.layout && theme.layout.indexOf('fixedBreadcrumbs') !== -1,
      'hided-breadcrumbs':
        theme.layout && theme.layout.indexOf('hidedBreadcrumbs') !== -1
    });

    return (
      <Layout className={classnames}>
        <Header>
          <Menu
            onClick={this.handleClick}
            mode="horizontal"
            selectedKeys={this.getSelectedMenuKeys()}
            theme={theme.leftSide}
          >
            {this.getNavMenuItems(menu)}
          </Menu>
        </Header>
        <Content className="router-page">
          <Switch>{childRoutes}</Switch>
        </Content>
        <SkinToolbox onChangeTheme={this.onChangeTheme} theme={theme} />
      </Layout>
    );
  }
}

CardLayout.propTypes = {
  routerData: PropTypes.object,
  global: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
};

export default CardLayout;
