import React, { Component } from 'react';
import cx from 'classnames';
import { Tabs } from 'antd';
import $$ from 'cmn-utils';
import intl from "react-intl-universal";
import PropTypes from 'prop-types';

import SideBarBox from './SideBarBox';
import NavBarBox from './NavBarBox';
import LayoutBox from "./LayoutBox";
import messages from './messages';

import './style/index.less';

const { TabPane } = Tabs;

/**
 * Set the right side of the skin to slide the panel
 */
class SkinToolbox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: true,
    }
  }

  onChangeSideColor = e => {
    this.props.onChangeTheme({
      ...this.props.theme,
      leftSide: e.target.value
    });
  };

  onChangeNavBarColor = e => {
    this.props.onChangeTheme({
      ...this.props.theme,
      navbar: e.target.value
    });
  };

  onChangeLayout = value => {
    this.props.onChangeTheme({
      ...this.props.theme,
      layout: value
    });
  }

  clearThemeStore = _ => {
    $$.removeStore('theme');
    window.location.reload();
  }

  /**
   * Switch skin settings panel
   */
  toggleSkinToolbox = _ => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  render() {
    const { theme } = this.props;

    const classnames = cx('skin-toolbox', {
      'skin-toolbox-close': this.state.collapsed
    });

    return (
      <div className={classnames}>
        <div className="panel">
          <div className="panel-head" onClick={this.toggleSkinToolbox}>
            <span className="panel-icon">
              <i className="las la-cog" />
            </span>
            <span className="panel-title">{intl.formatMessage(messages.Setyourtheme)}</span>
          </div>
          <div className="panel-body">
            <Tabs defaultActiveKey="1" size="small">
              <TabPane tab={intl.formatMessage(messages.Navigationbar)} key="navbar">
                <h4>{intl.formatMessage(messages.Navigationbar)}</h4>
                <NavBarBox theme={theme} onChange={this.onChangeNavBarColor} />
              </TabPane>
              <TabPane tab={intl.formatMessage(messages.Navigationbarstyle)} key="sidebar">
                <h4>{intl.formatMessage(messages.Navigationbarstyle)}</h4>
                <SideBarBox theme={theme} onChange={this.onChangeSideColor} />
              </TabPane>
              <TabPane tab={intl.formatMessage(messages.Layoutstyle)} key="misc">
                <h4>{intl.formatMessage(messages.Layoutstyle)}</h4>
                <LayoutBox theme={theme} onChange={this.onChangeLayout} />
              </TabPane>
            </Tabs>
          </div>
          <div className="panel-footer">
            <button className="btn-primary" onClick={this.clearThemeStore}>{intl.formatMessage(messages.Cleanupstorage)}</button>
          </div>
        </div>
      </div>
    );
  }
}

SkinToolbox.propTypes = {
  onChangeTheme: PropTypes.func,
  theme: PropTypes.object,
};

export default SkinToolbox;
