/**
 * source
 * https://github.com/ant-design/ant-design-pro/blob/master/src/components/SiderMenu/SiderMenu.js
 */
import React, { PureComponent } from 'react';
import cx from 'classnames';
import { Menu, Layout, Switch, Select, Drawer } from 'antd';
import { router } from 'dva';
import isEqual from 'react-fast-compare';
import PropTypes from 'prop-types';
import { ReactSVG } from 'react-svg'
import intl from "react-intl-universal";

import messages from './messages';

import logoImg from 'assets/images/logo.svg';
import userImg from 'assets/images/user.svg';
import './style/index.less';

const { Link } = router;
const Option = Select.Option;
const { Sider } = Layout;
const { SubMenu } = Menu;
// Allow menu.js config icon as string or ReactNode
//   icon: 'setting',
//   icon: 'http://demo.com/icon.png',
//   icon: <Icon type="setting" />,
const getIcon = icon => {
  if (typeof icon === 'string') {
    return <ReactSVG src={icon} className={`sider-menu-item-img`} />;
  }
  return icon;
};

export const getMeunMatchKeys = (flatMenu, path) => {
  return flatMenu.filter(item => {
    return item.path.indexOf(path) > -1
  });
};

class LeftSideBar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      openKeys: props.currentMenu ? props.currentMenu.parentPath : []
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      !isEqual(
        this.props.currentMenu.parentPath,
        prevProps.currentMenu.parentPath
      )
    ) {
      this.setState({
        openKeys: this.props.currentMenu.parentPath || []
      });
    }
  }

  /**
   * Determine if it is an http link. Return Link or a
   * Judge whether it is http link.return a or Link
   * @memberof SiderMenu
   */
  getMenuItemPath = item => {
    const itemPath = this.conversionPath(item.path);
    const icon = getIcon(item.icon);
    const { isMobile, onCollapse } = this.props;
    const { target, name } = item;
    // Is it a http link
    if (/^https?:\/\//.test(itemPath)) {
      return (
        <a href={itemPath} target={target}>
          {icon}
          <span>{name}</span>
        </a>
      );
    }
    return (
      <Link
        to={itemPath}
        target={target}
        replace={itemPath === this.props.location.pathname}
        onClick={isMobile ? onCollapse : () => {}}
      >
        {icon}
        <span>{name}</span>
      </Link>
    );
  };

  /**
   * get SubMenu or Item
   */
  getSubMenuOrItem = item => {
    if (item.children && item.children.some(child => child.name)) {
      const childrenItems = this.getNavMenuItems(item.children);
      if (childrenItems && childrenItems.length > 0) {
        return (
          <SubMenu
            style={item.style}
            title={
              item.icon ? (
                <span>
                  {getIcon(item.icon)}
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
        <Menu.Item key={item.path} style={item.style}>{this.getMenuItemPath(item)}</Menu.Item>
      );
    }
  };
  /**
   * Get menu subnode
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
    const pathname = this.props.location.pathname;
    const selectMenu = getMeunMatchKeys(this.props.flatMenu, pathname)[0];
    return selectMenu ? [selectMenu.path] : [];
  };

  isMainMenu = key => {
    return this.props.menu.some(
      item => key && (item.key === key || item.path === key)
    );
  };

  handleOpenChange = openKeys => {
    const lastOpenKey = openKeys[openKeys.length - 1];
    const moreThanOne =
      openKeys.filter(openKey => this.isMainMenu(openKey)).length > 1;
    this.setState({
      openKeys: moreThanOne ? [lastOpenKey] : [...openKeys]
    });
  };

  render() {
    const {
      fixed,
      theme,
      collapsed,
      onCollapse,
      onCollapseAll,
      leftCollapsedWidth,
      showHeader,
      menu,
      user,
      isMobile
    } = this.props;

    const classnames = cx('sidebar-left', 'sidebar-default', {
      affix: !!fixed,
      'sidebar-left-sm': collapsed,
      'show-header': collapsed ? false : showHeader,
      'sidebar-left-close': leftCollapsedWidth === 0,
      [theme]: !!theme
    });

    const { openKeys } = this.state;
    // if pathname can't match, use the nearest parent's key
    let selectedKeys = this.getSelectedMenuKeys();
    // Don't show popup menu when it is been collapsed
    const menuProps = collapsed
      ? {
          selectedKeys
        }
      : {
          openKeys,
          selectedKeys
        };

    const siderBar = (
      <Sider
        className={classnames}
        width={230}
        collapsedWidth={leftCollapsedWidth + 0.1}
        collapsible
        collapsed={isMobile ? false : collapsed}
        onCollapse={isMobile ? null : onCollapse}
        breakpoint="lg"
        trigger={null}
      >
        <div className="sidebar-left-content">
          <header className="sidebar-header">
            <div className="userlogged clearfix">
              <div className="user-details">
                <span className="border-user">
                  <img src={userImg} alt="user"/>
                </span>
                <span>{user.name}<small><small>님</small></small></span>
              </div>
              <div className="button-html">
                <small>HTML 퍼블리싱</small> <br/>
                <strong>빠른 견적 시스템</strong>
              </div>
            </div>
          </header>
          <Menu
            onClick={this.handleClick}
            onOpenChange={this.handleOpenChange}
            mode="inline"
            theme={theme}
            {...menuProps}
          >
            {this.getNavMenuItems(menu)}
          </Menu>
          {/*<div className="sidebar-toggle-mini">*/}
          {/*  {collapsed && leftCollapsedWidth !== 0 && !isMobile ? (*/}
          {/*    <Switch*/}
          {/*      checked={collapsed}*/}
          {/*      onChange={onCollapseAll}*/}
          {/*      size="small"*/}
          {/*    />*/}
          {/*  ) : null}*/}
          {/*</div>*/}
        </div>
      </Sider>
    );

    return isMobile ? (
      <Drawer
        className="left-sidebar-drawer"
        visible={!collapsed}
        placement="left"
        onClose={onCollapse}
        width={230}
        closable={false}
      >
        <div className="navbar-branding">
          <div className="navbar-brand">
            <img src={logoImg} alt="logo" />
            <b>LANIF</b>
            Admin
          </div>
          <span className="toggle_sidemenu_l" onClick={onCollapse}>
            <i className="las la-bars" />
          </span>
        </div>
        {siderBar}
      </Drawer>
    ) : (
      siderBar
    );
  }
}

LeftSideBar.propTypes = {
  fixed: PropTypes.bool,
  collapsed: PropTypes.bool,
  isMobile: PropTypes.bool,
  showHeader: PropTypes.bool,
  theme: PropTypes.string,
  currentMenu: PropTypes.object,
  location: PropTypes.object,
  user: PropTypes.any,
  onCollapse: PropTypes.func,
  onCollapseAll: PropTypes.func,
  flatMenu: PropTypes.array,
  menu: PropTypes.array,
  leftCollapsedWidth: PropTypes.number,
};

LeftSideBar.defaultProps = {
  fixed: true,
  theme: ''
};

export default LeftSideBar;
