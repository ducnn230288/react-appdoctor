import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import isEqual from 'react-fast-compare';

function noop() {}

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: []
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!isEqual(nextProps.dataSource, prevState.dataSource)) {
      return {
        dataSource: nextProps.dataSource
      };
    }
    return null;
  }

  handleDeleteItem = (e, items) => {
    e.preventDefault();
    e.stopPropagation();

    this.props.onDeleteItem(items ? items : this.state.dataSource);
  };

  renderItem = (i, key) => {
    const { render, titleKey, rowKey } = this.props;

    let item = this.state.dataSource[i];

    return (
      <li
        className="list-comp-item"
        data-key={item[rowKey]}
        title={item[titleKey]}
        key={item[rowKey]}
      >
        <span className="list-comp-item-body">
          {render ? render(item) : item.title}
        </span>
        <button
          className={`list-comp-clear-item`}
          onClick={e => this.handleDeleteItem(e, [item])}
        >
          <i className="las la-times" />
        </button>
      </li>
    );
  };

  render() {
    const { prefixCls, notFoundContent, style, max } = this.props;

    const listCls = classNames({
      [prefixCls]: true
    });

    let unit = 'article';

    return (
      <div className={listCls} style={style}>
        <div className={`${prefixCls}-header`}>
          <span className={`${prefixCls}-header-selected`}>
            <span>
              {this.state.dataSource.length} {max ? ` / ${max}` : ''} {unit}
            </span>
            <span className={`${prefixCls}-header-title`}>
              <button
                className={`${prefixCls}-clear-all`}
                onClick={e => this.handleDeleteItem(e)}
              >
                Delete all
              </button>
            </span>
          </span>
        </div>
        <div className={`${prefixCls}-body`}>
          <div className={`${prefixCls}-body-content`}>
            {!!this.state.dataSource.length || (
              <div className={`${prefixCls}-body-content-not-found`}>
                {notFoundContent || 'The list is empty'}
              </div>
            )}
            {this.state.dataSource.map((item, i) =>
              this.renderItem(i, item[this.props.rowKey])
            )}
          </div>
        </div>
      </div>
    );
  }
}

List.defaultProps = {
  prefixCls: 'antui-transfer-tree-list',
  dataSource: [],
  rowKey: 'key',
  onDeleteItem: noop,
};

List.propTypes = {
  prefixCls: PropTypes.string,
  dataSource: PropTypes.array,
  rowKey: PropTypes.string,
  style: PropTypes.object,
  render: PropTypes.func,
  onDeleteItem: PropTypes.func,
  max: PropTypes.number,
  notFoundContent: PropTypes.string,
  titleKey: PropTypes.string,
};

export default List
