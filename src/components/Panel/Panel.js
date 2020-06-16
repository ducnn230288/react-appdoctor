import React, { Component } from 'react';
import cx from 'classnames';
import { Popconfirm, Modal, Button } from 'antd';
import isEqual from 'react-fast-compare';
import intl from "react-intl-universal";
import PropTypes from 'prop-types';

import CSSAnimate from 'components/CSSAnimate';
import messages from './messages';

import './style/index.less';

const confirm = Modal.confirm;
const noop = _ => {};
/**
 * Panel assembly
 */
class Panel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapse: props.collapse || false,
      expand: props.expand || false,
      refresh: 0,
      animationName: ''
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      'collapse' in nextProps &&
      !isEqual(nextProps.collapse, prevState.collapse)
    ) {
      return {
        collapse: !!nextProps.collapse
      };
    }

    if ('expand' in nextProps && !isEqual(nextProps.expand, prevState.expand)) {
      return {
        expand: !!nextProps.expand
      };
    }

    return null;
  }

  onExpand = expand => e => {
    const { onChange } = this.props;

    this.setState({
      expand,
      collapse: false
    });

    if (onChange) {
      onChange({
        expand,
        collapse: false
      });
    }
  };

  onCollapse = collapse => e => {
    const { onChange } = this.props;

    this.setState({
      collapse,
      expand: false
    });

    if (onChange) {
      onChange({
        collapse,
        expand: false
      });
    }
  };

  onRefresh = () => {
    this.setState({
      refresh: this.state.refresh + 1,
      animationName: 'fadeIn'
    });
    this.props.onRefresh && this.props.onRefresh();
  };

  onClose = () => {
    const { expand } = this.state;
    if (expand) {
      confirm({
        title: intl.formatMessage(messages.prompt),
        content: intl.formatMessage(messages.sureClose),
        onOk: () => {
          this.props.onClose && this.props.onClose();
        }
      });
    } else {
      this.props.onClose && this.props.onClose();
    }
  };

  render() {
    const { expand, collapse, refresh, animationName } = this.state;
    const {
      theme,
      prefix,
      className,
      title,
      width,
      height,
      style,
      children,
      header,
      cover,
      scroll
    } = this.props;

    const classnames = cx(prefix, className, {
      theme: !!theme,
      'panel-fullscreen': !!expand,
      'panel-collapsed': !!collapse,
      cover: !!cover
    });

    const styles = {
      ...style,
      width
    };
    const bodyStyles = {};
    if (!expand) {
      bodyStyles.height = height;
    }
    if (scroll) {
      bodyStyles.overflow = 'auto';
    }

    const Header =
      typeof header === 'undefined' ? (
        <div className={`${prefix}-header`}>
          <span className={`${prefix}-header-title`}>{title}</span>
          <span className={`${prefix}-header-controls`}>
            <Button type="link" className="panel-control-loader" onClick={this.onRefresh}>
              <i className="las la-redo-alt" />
            </Button>
            <Button
              type="link"
              className="panel-control-fullscreen"
              onClick={this.onExpand(expand ? false : true)}
            >
              <i className={`${expand ? 'las la-compress-arrows-alt' : 'las la-expand-arrows-alt'}`} />
            </Button>
            <Button
              type="link"
              className="panel-control-collapsed"
              onClick={this.onCollapse(collapse ? false : true)}
            >
              <i className={`${collapse ? 'las la-plus' : 'las la-minus'}`} />
            </Button>
            <Popconfirm
              title={intl.formatMessage(messages.sureClose)}
              onConfirm={this.onClose}
              placement="topRight"
            >
              <Button 
                type="link"
                className="panel-control-remove"
                onClick={expand ? this.onClose : noop}
              >
                <i className="las la-times" />
              </Button>
            </Popconfirm>
          </span>
        </div>
      ) : (
        header
      );

    return (
      <div className={classnames} style={styles}>
        {Header}
        <div className={`${prefix}-body`} style={bodyStyles}>
          <CSSAnimate
            className="panel-content"
            type={animationName}
            callback={_ => this.setState({ animationName: '' })}
            key={refresh}
          >
            {children}
          </CSSAnimate>
        </div>
      </div>
    );
  }
}

Panel.propTypes = {
  collapse: PropTypes.bool,
  expand: PropTypes.bool,
  theme: PropTypes.bool,
  cover: PropTypes.bool,
  scroll: PropTypes.bool,
  prefix: PropTypes.string,
  className: PropTypes.string,
  title: PropTypes.any,
  width: PropTypes.number,
  height: PropTypes.number,
  style: PropTypes.string,
  onChange: PropTypes.func,
  onRefresh: PropTypes.func,
  onClose: PropTypes.func,
  children: PropTypes.node,
  header: PropTypes.node,
  fit: PropTypes.bool
};

Panel.defaultProps = {
  prefix: 'antui-panel',
  fit: false,
};

export default Panel;
