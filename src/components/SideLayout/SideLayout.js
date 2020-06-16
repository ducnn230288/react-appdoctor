import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Layout } from 'antd';
import cx from 'classnames';
import intl from "react-intl-universal";

import messages from './messages';
import './style/index.less';

const { Content, Sider } = Layout;

class SideLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openSide: true
    };
  }

  toggle = e => {
    e.stopPropagation();
    e.preventDefault();

    this.setState({
      openSide: !this.state.openSide
    });
  };

  render() {
    const {
      prefixCls,
      className,
      sideContent,
      children,
      title,
      width
    } = this.props;
    const { openSide } = this.state;
    return (
      <Layout className={cx(prefixCls, className)}>
        <Sider
          trigger={null}
          collapsible
          collapsed={!openSide}
          collapsedWidth={0}
          width={width}
        >
          <button className="side-handle" onClick={this.toggle} title={openSide ? intl.formatMessage(messages.Collapse) : intl.formatMessage(messages.Expand)}>
            <i className={openSide ? 'las la-angle-left' : 'las la-angle-right'} />
          </button>
          <div
            className="side-body"
            style={!openSide ? { width: 0 } : { width }}
          >
            <div className="side-panel">
              <div className="panel-header">
                <i className="las la-folder" />
                &nbsp;
                <strong>{title}</strong>
              </div>
              <div className="panel-body">{sideContent}</div>
            </div>
          </div>
        </Sider>
        <Content>{children}</Content>
      </Layout>
    );
  }
}

SideLayout.propTypes = {
  className: PropTypes.string,
  prefixCls: PropTypes.string,
  width: PropTypes.number,
  title: PropTypes.string,
  sideContent: PropTypes.node,
  children: PropTypes.node,
};

SideLayout.defaultProps = {
  prefixCls: 'antui-side-layout',
  width: 180
};

export default SideLayout;
