import React, { PureComponent } from 'react';
import { Popover, Badge, Avatar } from 'antd';
import { router } from 'dva';
import cx from 'classnames';
import intl from 'react-intl-universal';
import PropTypes from 'prop-types';

import routerLinks from "@/utils/routerLinks";
import SearchBox from './SearchBox';
import messages from './messages';

import logoImg from 'assets/images/logo.svg';
import logoMobileImg from 'assets/images/logo-mobile.svg';
import './style/index.less';

const { Link } = router;

/**
 * Head office area
 */
class NavBar extends PureComponent {
  constructor (props) {
    super(props);
    this.state = {
      openSearchBox: false
    };
  }

  toggleFullScreen() {
    if (
      !document.fullscreenElement &&
      !document.mozFullScreenElement &&
      !document.webkitFullscreenElement &&
      !document.msFullscreenElement
    ) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(
          Element.ALLOW_KEYBOARD_INPUT
        );
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  }

  onCloseSearchBox = () => {
    this.setState({
      openSearchBox: false
    });
  };

  onOpenSearchBox = () => {
    this.setState({
      openSearchBox: true
    });
  };

  render() {
    const { openSearchBox } = this.state;
    const {
      fixed,
      theme,
      onCollapseLeftSide,
      collapsed,
      onExpandTopBar,
      toggleSidebarHeader,
      user,
      isMobile
    } = this.props;

    const classnames = cx('navbar', {
      'navbar-fixed-top': !!fixed,
      'navbar-sm': isMobile ? true : collapsed,
      ['bg-' + theme]: !!theme
    });

    return (
      <header className={classnames}>
        <div className="navbar-branding">
          <Link className="navbar-brand" to="/">
            <img src={(isMobile ? true : collapsed) ? logoMobileImg : logoImg} alt="logo" />
          </Link>
          <span className="toggle_sidemenu_l" onClick={onCollapseLeftSide}>
            <i className="las la-bars" />
          </span>
        </div>
        {isMobile && (
          <div className="nav navbar-nav navbar-left clearfix">
            <img src={logoImg} alt="logo" />
          </div>
        )}
      </header>
    );
  }
}

const UserDropDown = props => (
  <ul className="dropdown-menu list-group dropdown-persist">
    <li className="list-group-item">
      <button className="animated animated-short fadeInUp">
        <i className="las la-mail-bulk" /> {intl.formatMessage(messages.information)}
        <Badge count={5} className="label" />
      </button>
    </li>
    <li className="list-group-item">
      <button className="animated animated-short fadeInUp">
        <i className="las la-users" /> {intl.formatMessage(messages.friend)}
        <Badge count={6} className="label" />
      </button>
    </li>
    <li className="list-group-item">
      <button className="animated animated-short fadeInUp">
        <i className="las la-cog" /> {intl.formatMessage(messages.acountSetting)}
      </button>
    </li>
    <li className="list-group-item">
      <button className="animated animated-short fadeInUp">
        <i className="las la-bell" /> {intl.formatMessage(messages.notification)}
      </button>
    </li>
    <li className="list-group-item dropdown-footer">
      <Link to={routerLinks("Login")}>
        <i className="las la-power-off" /> {intl.formatMessage(messages.logOut)}
      </Link>
    </li>
  </ul>
);

NavBar.propTypes = {
  theme: PropTypes.string,
  language: PropTypes.string,
  fixed: PropTypes.bool,
  collapsed: PropTypes.bool,
  isMobile: PropTypes.bool,
  onCollapseLeftSide: PropTypes.func,
  toggleSidebarHeader: PropTypes.func,
  onChangeLanguage: PropTypes.func,
  user: PropTypes.any,
};

NavBar.defaultProps = {
  fixed: true,
  theme: '' // 'bg-dark',
};

export default NavBar;
