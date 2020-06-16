import React from 'react';
import { Button } from 'antd';
import cx from 'classnames';
import PropTypes from 'prop-types';

import './style/index.less';

class Toolbar extends React.Component {
  constructor() {
    super();

    this.state = {
      openPullDown: false
    };
  }

  togglePullDown = e => {
    e.stopPropagation();
    e.preventDefault();

    this.setState({
      openPullDown: !this.state.openPullDown
    });
  };

  render() {
    const {
      prefixCls,
      className,
      appendLeft,
      pullDownExclude,
      childrenClassName,
      children,
      pullDown
    } = this.props;

    return (
      <div className={cx(prefixCls, className)}>
        <div className="content-box">
          <div className="top-panel">
            <div className="left-btn-div">{appendLeft}</div>
            <div
              className={cx(childrenClassName, {
                'toolbar-right-out': pullDownExclude && this.state.openPullDown
              })}
            >
              {children}
            </div>
            <div className="pulldown-handle-small">
              {pullDown ? (
                <Button onClick={e => this.togglePullDown(e)}>
                  <i type={this.state.openPullDown ? 'las la-angle-up' : 'las la-angle-down'} />
                  {this.state.openPullDown ? 'Collapse' : 'Expand'}
                </Button>
              ) : null}
            </div>
          </div>
          {pullDown ? (
            <div
              className={cx('pulldown-panel', {
                open: this.state.openPullDown
              })}
            >
              <span
                className="pulldown-handle"
                title={this.state.openPullDown ? 'Collapse' : 'Expand'}
                onClick={e => this.togglePullDown(e)}
              >
                <i className={this.state.openPullDown ? 'las la-angle-up' : 'las la-angle-down'} />
                {this.state.openPullDown ? 'Collapse' : 'Expand'}
              </span>
              <div className="pulldown-body">{pullDown}</div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

Toolbar.propTypes = {
  prefixCls: PropTypes.string,
  appendLeft: PropTypes.node,
  children: PropTypes.node,
  childrenClassName: PropTypes.string,
  pullDown: PropTypes.any,
  pullDownExclude: PropTypes.bool
};

Toolbar.defaultProps = {
  pullDownExclude: true,
  childrenClassName: 'toolbar-right',
  prefixCls: 'antui-toolbar-box'
};

export default Toolbar