import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Masonry from 'masonry-layout';
import cx from 'classnames';
import isEqual from 'react-fast-compare';

import resizeMe from '@/decorator/resizeMe';

import './style/index.less';

/**
 * Waterfall flow component
 */
@resizeMe({ refreshRate: 50 })
class WaterFall extends PureComponent {
  componentDidMount() {
    const {
      columnWidth,
      gutter,
      horizontalOrder,
      percentPosition,
      fitWidth,
      getInstance
    } = this.props;

    this.msnry = new Masonry(this.node, {
      itemSelector: '.antui-waterfall-item',
      columnWidth:
        typeof columnWidth === 'string' ? '.antui-waterfall-item' : columnWidth,
      gutter,
      horizontalOrder,
      percentPosition,
      fitWidth
    });

    this.msnry.on('layoutComplete', this.onLayoutComplete);

    if (getInstance) getInstance(this.msnry);
  }

  componentDidUpdate(prevProps, prevState) {
    if (!isEqual(prevProps.size, this.props.size)) {
      this.msnry.layout();
    }
  }

  componentWillUnmount() {
    this.msnry.off('layoutComplete', this.onLayoutComplete);
    this.msnry.destroy();
  }

  onLayoutComplete = items => {
    const { onLayout } = this.props;
    onLayout && onLayout(items, this.msnry);
  }

  renderItem = dataSource => {
    const { render, columnWidth, gutter, itemStyle } = this.props;
    const renderFunc = render ? render : item => item;

    const style = {
      width: columnWidth
    };
    if (gutter) {
      style.marginBottom = gutter;
    }

    return dataSource.map((item, index) => {
      return (
        <div
          key={index}
          className="antui-waterfall-item"
          style={{ ...style, ...itemStyle }}
        >
          {renderFunc(item, index)}
        </div>
      );
    });
  };

  render() {
    const { prefixCls, className, dataSource, style } = this.props;
    const classnames = cx(prefixCls, className);
    return (
      <div
        ref={node => (this.node = node)}
        className={classnames}
        style={style}
      >
        {this.renderItem(dataSource)}
      </div>
    );
  }
}

WaterFall.propTypes = {
  dataSource: PropTypes.array,
  columnWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  gutter: PropTypes.number,
  horizontalOrder: PropTypes.bool,
  percentPosition: PropTypes.bool,
  fitWidth: PropTypes.bool,
  prefixCls: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.string,
  render: PropTypes.func,
  onLayout: PropTypes.func,
  getInstance: PropTypes.func,
  itemStyle: PropTypes.object,
  size: PropTypes.object,
};

WaterFall.defaultProps = {
  prefixCls: 'antui-waterfall'
};

export default WaterFall;
