import React from 'react';
import { connect, router, routerRedux } from 'dva';
import { Layout } from 'antd';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import $$ from 'cmn-utils';
import cx from 'classnames';
import isEqual from 'react-fast-compare';
import PropTypes from 'prop-types';

import NavBar from 'components/NavBar';
import TopBar from 'components/TopBar';
import SkinToolbox from 'components/SkinToolbox';
import { LeftSideBar, RightSideBar } from 'components/SideBar';
import routerLinks from "@/utils/routerLinks";
import { enquireIsMobile } from '@/utils/enquireScreen';
import TabsLayout from './TabsLayout';

import 'assets/styles/transition.less';
import './styles/basic.less';

const { Switch } = router;
const { Content, Header } = Layout;

/**
 * Basic department
 * Can set a variety of skin theme: [light, grey, primary, info, warning, danger, alert, system, success, dark]
 * A variety of layouts can be set [header, sidebar, breadcrumb, tabLayout]
 */
@connect(({ global }) => ({ global }))
class BasicLayout extends React.PureComponent {
  constructor(props) {
    super(props);
    const user = $$.getStore('user', []);
    const theme = $$.getStore('theme', {
      navbar: 'warning',
      leftSide: 'dark',
      layout: [
        'fixedHeader',
        'fixedSidebar',
        'fixedBreadcrumbs'
      ]
    });

    this.state = {
      collapsedLeftSide: false, // Left sidebar switch control
      leftCollapsedWidth: 60, // Left column width
      expandTopBar: false, // Head multi-function area opening and closing
      showSidebarHeader: false, // Left side head switch
      collapsedRightSide: true, // Right sidebar switch
      theme, // Skin settings
      user,
      currentMenu: {},
      isMobile: false
    };

    props.dispatch({
      type: 'global/getMenu'
    });
  }

  componentDidMount() {
    this.checkLoginState();

    this.unregisterEnquire = enquireIsMobile(ismobile => {
      const { isMobile, theme } = this.state;
      if (isMobile !== ismobile) {
        // If the check is mobile, the sidebar is not fixed.
        if (ismobile && $$.isArray(theme.layout)) {
          theme.layout = theme.layout.filter(item => item !== 'fixedSidebar');
        }
        this.setState({
          isMobile: ismobile
        });
      }
    });
  }

  // Check if a user is logged in
  checkLoginState() {
    const user = $$.getStore('user');
    if (!user) {
      this.props.dispatch(routerRedux.replace(routerLinks("Login")));
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      !isEqual(this.props.location.pathname, prevProps.location.pathname) ||
      !isEqual(this.props.global.flatMenu, prevProps.global.flatMenu)
    ) {
      this.setState({
        currentMenu: this.getCurrentMenu(this.props) || {}
      });
    }
  }

  componentWillUnmount() {
    // Clean up monitoring
    this.unregisterEnquire();
  }

  getCurrentMenu(props) {
    const {
      location: { pathname },
      global
    } = props || this.props;
    const menu = this.getMeunMatchKeys(global.flatMenu, pathname)[0];
    return menu;
  }

  getMeunMatchKeys = (flatMenu, path) => {
    return flatMenu.filter(item => {
      return item.path.indexOf(path) > -1
    });
  };

  /**
   * Top left menu icon shrink control
   */
  onCollapseLeftSide = _ => {
    const collapsedLeftSide =
      this.state.leftCollapsedWidth === 0
        ? true
        : !this.state.collapsedLeftSide;
    const collapsedRightSide =
      this.state.collapsedRightSide || !collapsedLeftSide;

    this.setState({
      collapsedLeftSide,
      collapsedRightSide,
      leftCollapsedWidth: 60
    });
  };

  /**
   * Close the left sidebar completely, that is, the width is 0
   */
  onCollapseLeftSideAll = _ => {
    this.setState({
      collapsedLeftSide: true,
      leftCollapsedWidth: 0
    });
  };

  /**
   * Expand the multifunction area in the bar where the breadcrumbs are located
   */
  onExpandTopBar = _ => {
    this.setState({
      expandTopBar: true
    });
  };

  /**
   * Contrary to above
   */
  onCollapseTopBar = _ => {
    this.setState({
      expandTopBar: false
    });
  };

  /**
   * Toggle the opening and closing of the head in the left column
   */
  toggleSidebarHeader = _ => {
    this.setState({
      showSidebarHeader: !this.state.showSidebarHeader
    });
  };

  /**
   * Toggle the right column
   */
  toggleRightSide = _ => {
    const { collapsedLeftSide, collapsedRightSide } = this.state;
    this.setState({
      collapsedLeftSide: collapsedRightSide ? true : collapsedLeftSide,
      collapsedRightSide: !collapsedRightSide
    });
  };

  onChangeTheme = theme => {
    $$.setStore('theme', theme);
    this.setState({
      theme
    });
  };

  render() {
    const {
      collapsedLeftSide,
      leftCollapsedWidth,
      expandTopBar,
      showSidebarHeader,
      collapsedRightSide,
      theme,
      user,
      currentMenu,
      isMobile
    } = this.state;
    const { routerData, location, global } = this.props;
    const { menu, flatMenu } = global;
    const { childRoutes } = routerData;
    const classnames = cx('basic-layout', 'full-layout', {
      fixed: theme.layout && theme.layout.indexOf('fixedSidebar') !== -1,
      'fixed-header':
        theme.layout && theme.layout.indexOf('fixedHeader') !== -1,
      'fixed-breadcrumbs':
        theme.layout && theme.layout.indexOf('fixedBreadcrumbs') !== -1,
      'hided-breadcrumbs':
        theme.layout && theme.layout.indexOf('hidedBreadcrumbs') !== -1
    });
    const classnamesHeader = cx('navbar-siderbar', {
      'header-sm': isMobile ? true : collapsedLeftSide,
    });

    return (
      <Layout className={classnames}>
        <Header className={classnamesHeader}>
          <NavBar
            collapsed={collapsedLeftSide}
            onCollapseLeftSide={this.onCollapseLeftSide}
            onExpandTopBar={this.onExpandTopBar}
            toggleSidebarHeader={this.toggleSidebarHeader}
            theme={theme.navbar}
            user={user}
            isMobile={isMobile}
          />
        </Header>
        <Layout>
          <LeftSideBar
            collapsed={collapsedLeftSide}
            leftCollapsedWidth={leftCollapsedWidth}
            showHeader={showSidebarHeader}
            onCollapse={this.onCollapseLeftSide}
            onCollapseAll={this.onCollapseLeftSideAll}
            location={location}
            theme={theme.leftSide}
            flatMenu={flatMenu}
            currentMenu={currentMenu}
            menu={menu}
            user={user}
            isMobile={isMobile}
          />
          <Content>
            {theme.layout.indexOf('tabLayout') >= 0 ? (
              <TabsLayout childRoutes={childRoutes} location={location} />
            ) : (
              <Layout className="full-layout">
                <Header>
                  <TopBar
                    expand={expandTopBar}
                    toggleRightSide={this.toggleRightSide}
                    collapsedRightSide={collapsedRightSide}
                    onCollapse={this.onCollapseTopBar}
                    currentMenu={currentMenu}
                    location={location}
                    theme={theme}
                    menu={menu}
                  />
                </Header>
                <Content style={{ overflow: 'hidden' }}>
                  <SwitchTransition>
                    <CSSTransition
                      key={location.pathname}
                      classNames="fade"
                      timeout={500}
                    >
                      <Layout className="full-layout">
                        <Content className="router-page">
                          <Switch location={location}>{childRoutes}</Switch>
                        </Content>
                      </Layout>
                    </CSSTransition>
                  </SwitchTransition>
                </Content>
              </Layout>
            )}
          </Content>
          {/*<RightSideBar*/}
          {/*  collapsed={collapsedRightSide}*/}
          {/*  isMobile={isMobile}*/}
          {/*  onCollapse={this.toggleRightSide}*/}
          {/*/>*/}
        </Layout>
      </Layout>
    );
  }
}

BasicLayout.propTypes = {
  dispatch: PropTypes.func,
  routerData: PropTypes.object,
  location: PropTypes.object,
  global: PropTypes.object,
};

export default BasicLayout
