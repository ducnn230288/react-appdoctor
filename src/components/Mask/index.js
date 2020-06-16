import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import cssAnimate, { isCssAnimationSupported } from 'css-animation';
import PropTypes from 'prop-types';
import cx from 'classnames';
import $$ from 'cmn-utils';

import './style/index.less';

const noop = () => {};

class Mask extends PureComponent {
  componentDidMount() {
    const { visible, getContainer } = this.props;
    this.container = document.createElement('div');
    if ($$.isFunction(getContainer)) {
      const mountNode = getContainer(ReactDOM.findDOMNode(this));
      mountNode.appendChild(this.container);
    } else {
      document.body.appendChild(this.container);
    }
    this.toggle(visible);
  }

  componentDidUpdate(prevProps, prevState) {
    const { visible } = this.props;
    this.toggle(visible);
  }

  componentWillUnmount() {
    this.container.parentNode.removeChild(this.container);
  }

  toggle = visible => {
    const node = this.node;
    if (!node) return;
    if (visible) node.style.display = 'block';

    if (isCssAnimationSupported) {
      cssAnimate(node, `fade${visible ? 'In' : 'Out'}`, _ => {
        node.style.display = visible ? 'block' : 'none';
      });
    } else {
      node.style.display = visible ? 'block' : 'none';
    }
  };

  onClick = e => {
    const { onClose, prefixCls } = this.props;

    if (
      (e.target.classList.contains(prefixCls) ||
        e.target.classList.contains(prefixCls + '-close')) &&
      onClose
    ) {
      onClose(e);
    }
  };

  render() {
    const {
      children,
      className,
      prefixCls,
      maskClosable
    } = this.props;

    if (this.container) {
      return ReactDOM.createPortal(
        <div
          ref={node => this.node = node}
          className={cx(prefixCls, 'animated', 'animated-short', className)}
          onClick={maskClosable ? this.onClick : noop}
        >
          {children}
        </div>,
        this.container
      );
    }

    return <div></div>;
  }
}

Mask.propTypes = {
  prefixCls: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
  maskClosable: PropTypes.bool,
  visible: PropTypes.bool,
  getContainer: PropTypes.func,
  onClose: PropTypes.func,
};

Mask.defaultProps = {
  prefixCls: 'basic-mask',
  maskClosable: true
};

export default Mask;
