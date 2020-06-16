import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Pagination, Tooltip, Input, Button, DatePicker, Checkbox, Radio } from 'antd';
import objectAssign from 'object-assign';
import $$ from 'cmn-utils';
import cx from 'classnames';
import isEqual from 'react-fast-compare';
import moment from 'moment';
import intl from 'react-intl-universal';

import messages from './messages';
import { EditableCell } from './Editable';
import './style/index.less';

const { RangePicker } = DatePicker;
const CheckboxGroup = Checkbox.Group;
const RadioboxGroup = Radio.Group;

/**
 * Data table
 */
class DataTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedRowKeys: props.selectedRowKeys,
      selectedRows: this.getSelectedRows(props.selectedRowKeys),
      tableHeight: null
    };
  }

  // Convert value to object array
  getSelectedRows(value, oldValue = [], rowKey) {
    if (value) {
      return value.map(item => {
        if (typeof item === 'object') {
          return item;
        } else {
          const oldv = oldValue.filter(jtem => jtem[rowKey] === item)[0];
          return oldv || { [rowKey]: item };
        }
      });
    }
    return [];
  }

  componentDidUpdate(prevProps, prevState) {
    if (!isEqual(prevProps.selectedRowKeys, this.props.selectedRowKeys)) {
      this.setState({
        selectedRowKeys: this.props.selectedRowKeys,
        selectedRows: this.getSelectedRows(
          this.props.selectedRowKeys,
          prevState.selectedRows,
          this.props.rowKey
        )
      });
    }
  }

  searchInput = {};

  tableOnRow = (record, index) => {
    const { selectType } = this.props;

    let keys = selectType === 'radio' ? [] : this.state.selectedRowKeys || [];
    let rows = selectType === 'radio' ? [] : this.state.selectedRows || [];

    let i = keys.indexOf(record[this._rowKey]);
    if (i !== -1) {
      keys.splice(i, 1);
      rows.splice(i, 1);
    } else {
      keys.push(record[this._rowKey]);
      rows.push(record);
    }

    this.onSelectChange([...keys], [...rows]);
  };

  onSelectChange = (selectedRowKeys, newSelectedRows) => {
    // Use the keys to re-filter the rows based on the key, solve the problem of keys and rows are not synchronized
    // and add a rowKey field to each line
    const selectedRows = newSelectedRows.filter(
      item => item ? selectedRowKeys.indexOf(item[this._rowKey]) !== -1 : false
    );

    this.setState({ selectedRowKeys, selectedRows }, () => {
      newSelectedRows = newSelectedRows.filter(item => !!item);
      this.props.onSelect && this.props.onSelect(selectedRowKeys, newSelectedRows);
    });
  };

  handleTableChange = (pagination, filters, sorts) => {
    let { pageNum, pageSize } = this.props.dataItems

    if (pagination.current) {
      pageNum = pagination.current;
      pageSize = pagination.pageSize;
    }

    let sortMap = sorts.field
      ? {
          [sorts.field]: sorts.order
        }
      : sorts;

    Object.keys(filters).forEach(key => {
      if (filters[key] === null) {
        delete filters[key];
      }
    });

    this.props.onChange &&
      this.props.onChange({ pageNum, pageSize, filters, sorts: sortMap });
  };

  onShowSizeChange = (pageNum, pageSize) => {
    const { filters, sorts } = this.props.dataItems
    console.log("onShowSizeChange", pageNum, pageSize)
    this.props.onChange && this.props.onChange({ pageNum, pageSize, filters, sorts });
  };

  getColumnSearchInput = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div>
        <Input
          ref={node => {
            this.searchInput[dataIndex] = node;
          }}
          placeholder={`${intl.formatMessage(messages.search)} ${dataIndex}`}
          value={selectedKeys}
          onChange={e => setSelectedKeys(e.target.value)}
          onPressEnter={() => confirm()}
        />
        <Button onClick={() => {
          clearFilters()
          setTimeout(() => clearFilters())
        }} size="small">
          {intl.formatMessage(messages.reset)}
        </Button>
        <Button
          type="primary"
          onClick={() => confirm()}
          icon={<i className="las la-search" />}
          size="small"
        >
          {intl.formatMessage(messages.search)}
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <i className="las la-search" style={{ color: filtered ? '#5d78ff' : undefined }} />
    ),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput[dataIndex].select());
      }
    }
  });

  getColumnSearchDate = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
      const dateRangePicker = selectedKeys.length > 0 ? [moment(selectedKeys[0]), moment(selectedKeys[1])] : [];
      return (
        <div>
          <RangePicker
            ref={node => {
              this.searchInput[dataIndex] = node;
            }}
            value={dateRangePicker}
            onChange={e => setSelectedKeys(e)}
          />
          <Button
            onClick={() => {
              clearFilters()
              setTimeout(() => clearFilters())
            }}
            size="small">
            {intl.formatMessage(messages.reset)}
          </Button>
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<i className="las la-search" />}
            size="small"
          >
            {intl.formatMessage(messages.search)}
          </Button>
        </div>
      )
    },
    filterIcon: filtered => (
      <i className="las la-calendar" style={{ color: filtered ? '#5d78ff' : undefined }} />
    )
  });

  getColumnSearchCheckbox = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, filters }) => {
      return (
        <div>
          <CheckboxGroup
            options={filters.map(item => { return { label: item.codeName, value: item.code }})}
            value={selectedKeys}
            onChange={e => setSelectedKeys(e)}
          />
          <Button onClick={() => {
            clearFilters()
            setTimeout(() => clearFilters())
          }} size="small">
            {intl.formatMessage(messages.reset)}
          </Button>
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<i className="las la-search" />}
            size="small"
          >
            {intl.formatMessage(messages.search)}
          </Button>
        </div>
      )
    },
    filterIcon: filtered => (
      <i className="las la-check-square" style={{ color: filtered ? '#5d78ff' : undefined }} />
    ),
  });

  getColumnSearchRadiobox = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, filters }) => {
      return (
        <div>
          <RadioboxGroup
            options={filters.map(item => { return { label: item.codeName, value: item.code }})}
            value={selectedKeys}
            onChange={e => setSelectedKeys(e.target.value)}
          />
          <Button onClick={() => {
            clearFilters()
            setTimeout(() => clearFilters())
          }} size="small">
            {intl.formatMessage(messages.reset)}
          </Button>
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<i className="las la-search" />}
            size="small"
          >
            {intl.formatMessage(messages.search)}
          </Button>
        </div>
      )
    },
    filterIcon: filtered => (
      <i className="las la-dot-circle" style={{ color: filtered ? '#5d78ff' : undefined }} />
    ),
  });

  render() {
    const {
      prefixCls,
      className,
      columns,
      dataItems,
      showNum,
      alternateColor,
      onChange,
      selectType,
      rowSelection,
      isScroll,
      pagination,
      rowKey,
      ...otherProps
    } = this.props;

    let classname = cx(prefixCls, className, {
      'table-row-alternate-color': alternateColor
    });

    let colRowKey = '';
    let hasLeftFixedCol = false; // Is there a fixed column on the left
    // Default width
    let cols = columns
      .filter(col => {
        if (col.primary) colRowKey = col.name;
        return !!col.tableItem;
      })
      .map(col => {
        let item = col.tableItem;
        // Select dictionary enhancement
        if (col.dict && !item.render) {
          item.render = (text, record) => {
            return (
              col.dict &&
              col.dict
                .filter(dic => dic.code === text)
                .map(dic => dic.codeName)[0]
            );
          };
        }
        // Is there a fixed column on the left
        if (item.fixed === true || item.fixed === 'left') {
          hasLeftFixedCol = true;
        }
        // Renders this column with the specified type if the type field is specified
        const myRender = item.render;
        if (item.type) {
          item.render = (text, record, index) => {
            if ($$.isFunction(item.editing) && item.editing(text, record)) {
              return (
                <EditableCell
                  text={text}
                  record={record}
                  index={index}
                  field={col}
                />
              );
            } else {
              return $$.isFunction(myRender)
                ? myRender(text, record, index)
                : text;
            }
          };
        }

        switch (item.filterType) {
          case "datetime":
            item = {...item, ...this.getColumnSearchDate(col.name)}
            break;
          case "input":
            item = {...item, ...this.getColumnSearchInput(col.name)}
            break;
          case "checkbox":
            item = {...item, ...this.getColumnSearchCheckbox(col.name)}
            break;
          case "radiobox":
            item = {...item, ...this.getColumnSearchRadiobox(col.name)}
            break;
          default:
        }

        return {
          title: col.title,
          dataIndex: col.name,
          ...item
        };
      })

    // Show line number
    if (showNum) {
      cols.unshift({
        title: 'Number',
        width: 50,
        dataIndex: '_num',
        ...(hasLeftFixedCol && { fixed: 'left' }),
        render(text, record, index) {
          const { pageNum, pageSize } = dataItems;
          if (pageNum && pageSize) {
            return (pageNum - 1) * pageSize + index + 1;
          } else {
            // No pagination
            return index + 1;
          }
        }
      });
    }

    // Pagination
    const paging = objectAssign(
      {
        total: dataItems.total,
        pageSize: dataItems.pageSize,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: total => `total ${total} article`,
        // onShowSizeChange: this.onShowSizeChange
      },
      dataItems.pageNum && { current: dataItems.pageNum },
      pagination
    );

    const _rowSelection = {
      type: selectType === 'radio' ? 'radio' : 'checkbox',
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this.onSelectChange,
      ...rowSelection
    };

    this._rowKey = rowKey || colRowKey;

    return (
      <div className={classname}>
        <Table
          rowSelection={selectType ? _rowSelection : null}
          onRow={
            selectType
              ? (record, index) => ({
                  onClick: _ => this.tableOnRow(record, index)
                })
              : () => {}
          }
          scroll={isScroll ? objectAssign({ x: true, scrollToFirstRowOnChange: true }, isScroll) : {}}
          // bodyStyle={{ overflowX: 'auto' }}
          columns={cols}
          pagination={pagination ? paging : false}
          dataSource={dataItems.list}
          onChange={this.handleTableChange}
          rowKey={this._rowKey}
          {...otherProps}
        />
      </div>
    );
  }
}

/**
 * Operating area, preventing upward bubbling
 */
export const Oper = prop => (
  <div className="table-row-button" onClick={e => e.stopPropagation()}>
    {prop.children}
  </div>
);

export const Tip = prop => (
  <Tooltip placement="topLeft" title={prop.children}>
    <div className="nobr" style={prop.style}>
      {prop.children}
    </div>
  </Tooltip>
);

export const Paging = ({ dataItems, onChange, ...otherProps }) => {
  const { total, pageSize, pageNum, filters, sorts } = dataItems;
  const paging = {
    total: total,
    pageSize: pageSize,
    current: pageNum,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: total => `${intl.formatMessage(messages.total)} ${total}`,
    onShowSizeChange: (pageNum, pageSize) => onChange({ pageNum, pageSize, filters, sorts }),
    onChange: pageNum => onChange({ pageNum, pageSize, filters, sorts }),
    ...otherProps
  };
  return <Pagination {...paging} />;
};

DataTable.Oper = Oper;
DataTable.Pagination = Paging;
DataTable.Tip = Tip;

DataTable.propTypes = {
  prefixCls: PropTypes.string,
  className: PropTypes.string,
  rowKey: PropTypes.string,
  /**
   * See the help document column.js usage for details
   */
  columns: PropTypes.array.isRequired,
  /**
   * The data object list is required. If you need paging in the form, you need to provide paging information here {pageNum: 1, list: [], filters: {}, pageSize: 10, total: 12}
   */
  dataItems: PropTypes.object.isRequired,
  /**
   * Whether to display the line number
   */
  showNum: PropTypes.bool,
  /**
   * Whether the odd and even rows are different colors
   */
  alternateColor: PropTypes.bool,
  /**
   * Multi-select / single-select, checkbox or radio
   */
  selectType: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  /**
   * Configuration of selection function Refer to antd's rowSelection configuration item
   */
  rowSelection: PropTypes.object,
  /**
   * Specifies the key array of the selected item
   */
  selectedRowKeys: PropTypes.array,
  /**
   * Whether to bring scroll bar, or as a scroll parameter
   */
  isScroll: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  /**
   * Whether to add pagination in the form
   */
  pagination: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  /**
   * Selected table row callback function (selectedRowKeys, selectedRows)
   */
  onSelect: PropTypes.func,
  /**
   * External data acquisition interface {pageNum: 1, filters: {}, pageSize: 10}
   */
  onChange: PropTypes.func
};

DataTable.defaultProps = {
  prefixCls: 'antui-datatable',
  alternateColor: true
};

export default DataTable;
