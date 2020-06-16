import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Select } from 'antd';
import $$ from 'cmn-utils';
import isEqual from 'react-fast-compare';
import assign from 'object-assign';
import intl from 'react-intl-universal';

import PageHelper from '@/utils/pageHelper';
import DataTable from 'components/DataTable';
import messages from '../messages';

const { Pagination } = DataTable;
const { Option } = Select;

/**
 *  formItem: {
      type: 'table',
      rowKey: 'id',
      dataSource,
      columns: innerColumns,
      onChange: (form, value) => console.log('。。。:', value),
      loadData: self.onLoadTableData,
      initialValue: [11, 3, 5],
    }
 */
class TableControlled extends Component {
  constructor(props) {
    super(props);
    const { dataSource, value } = props;
    this.state = {
      value: this.getKeys(value),
      rows: this.getRows(value),
      dataSource: dataSource || PageHelper.create(),
      visible: false,
      loading: false
    };
  }

  componentDidMount() {
    const { loadData } = this.props;
    if (loadData) {
      this.onChange({ pageNum: 1 });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { dataSource, value, loadData } = this.props;
    const { rows } = this.state;
    if (
      !isEqual(prevProps.dataSource, dataSource) ||
      !isEqual(prevProps.value, value)
    ) {
      const _value = this.getKeys(value);
      const newState = {
        value: _value,
        rows: this.getRows(_value, rows)
      };
      if (!loadData && dataSource) {
        newState.dataSource = dataSource;
      }

      this.setState(newState);
    }
  }

  // Convert value to object array
  getRows(value, oldValue = []) {
    const { rowKey } = this.props;
    if (value) {
      return value.map(item => {
        const oldv = oldValue.filter(jtem => jtem[rowKey] === item)[0];
        return typeof item === 'object' ? item : oldv || { [rowKey]: item };
      });
    }
    return [];
  }

  getKeys(value) {
    const { rowKey } = this.props;
    if (value) {
      return value.map(item => ($$.isObject(item) ? item[rowKey] : item));
    }
    return [];
  }

  onSelect = (keys, newRows) => {
    const { modal, onChange } = this.props;
    let { rows } = this.state;

    rows = [...rows, ...newRows];
    this.setState({ value: keys, rows });

    if (onChange && !modal) {
      onChange(keys, rows);
    }
  };

  async onChange({ pageNum, pageSize }) {
    const { loadData } = this.props;
    const { dataSource } = this.state;

    if (loadData) {
      this.setState({
        loading: true
      });

      const newDataSource = await loadData(
        dataSource.jumpPage(pageNum, pageSize)
      );

      this.setState({
        loading: false,
        dataSource: assign(dataSource, newDataSource)
      });
    }
  }

  onSelectChange = (value, option) => {
    const { rowKey, onChange } = this.props;
    const { rows } = this.state;
    const newRows = rows.filter(item => value.indexOf(item[rowKey]) !== -1);
    this.setState({
      value,
      rows: newRows
    });
    onChange && onChange(value, newRows);
  };

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  onSubmit = () => {
    const { value, rows } = this.state;
    const { onChange } = this.props;
    this.hideModal();
    onChange && onChange(value, rows);
  };

  hideModal = () => {
    this.setState({
      visible: false
    });
  };

  render() {
    const {
      modal,
      columns,
      titleKey,
      rowKey,
      selectType,
      showNum,
      placeholder,
      getPopupContainer,
      disabled,
      pagination,
      ...otherProps
    } = this.props;
    const { dataSource, value, rows, loading, visible } = this.state;

    const dataTableProps = {
      loading,
      columns,
      rowKey,
      dataItems: dataSource,
      selectedRowKeys: value,
      selectType: typeof selectType === 'undefined' ? 'checkbox' : selectType,
      showNum: typeof showNum === 'undefined' ? true : showNum,
      isScroll: true,
      onChange: ({ pageNum, pageSize }) => this.onChange({ pageNum, pageSize }),
      onSelect: this.onSelect,
      pagination:
        pagination === false
          ? false
          : {
              showSizeChanger: false,
              showQuickJumper: false,
              ...pagination
            }
    };
    if (modal || disabled) {
      return (
        <div>
          <div onClick={disabled ? () => {} : this.showModal}>
            <Select
              readOnly
              disabled={!!disabled}
              mode="multiple"
              open={false}
              value={titleKey ? value : value.length ? ['_selected'] : []}
              onChange={this.onSelectChange}
              placeholder={placeholder}
            >
              {titleKey ? (
                rows.map(item => (
                  <Option key={item[rowKey]} value={item[rowKey]}>
                    {item[titleKey]}
                  </Option>
                ))
              ) : (
                <Option key="_selected" value="_selected">
                  {intl.formatMessage(messages.chosen)} {value.length} {intl.formatMessage(messages.item)}
                </Option>
              )}
            </Select>
          </div>
          <Modal
            className="antui-table-modal"
            title={'Please choose ' + otherProps.title}
            visible={visible}
            width={modal.width || 600}
            onCancel={this.hideModal}
            footer={
              <>
                <div className="left">
                  {pagination === false ? null : (
                    <Pagination
                      key="paging"
                      size="small"
                      showSizeChanger={false}
                      showQuickJumper={false}
                      {...dataTableProps}
                    />
                  )}
                </div>
                <Button key="back" onClick={this.hideModal}>
                  {intl.formatMessage(messages.cancel)}
                </Button>
                <Button key="submit" type="primary" onClick={this.onSubmit}>
                  {intl.formatMessage(messages.save)}
                </Button>
              </>
            }
            {...modal}
          >
            <DataTable {...dataTableProps} pagination={false} />
          </Modal>
        </div>
      );
    }

    return <DataTable {...dataTableProps} />;
  }
}

TableControlled.propTypes = {
  value: PropTypes.array,
  dataSource: PropTypes.object,
  onChange: PropTypes.func,
  modal: PropTypes.any,
  rowKey: PropTypes.string,
  loadData: PropTypes.func,
  selectType: PropTypes.func,
  showNum: PropTypes.func,
  placeholder: PropTypes.string,
  getPopupContainer: PropTypes.func,
  disabled: PropTypes.bool,
  columns: PropTypes.array,
  titleKey: PropTypes.string,
};

TableControlled.defaultProps = {
  value: [],
  rowKey: 'id',
  modal: {}
};

/**
 * TableForm component
 */
export default ({
  form,
  name,
  formFieldOptions = {},
  record,
  defaultValue,
  rules,
  onChange,
  dataSource,
  normalize,
  rowKey,
  placeholder,
  ...otherProps
}) => {

  let initval = defaultValue;

  if (record) {
    initval = record[name];
  }

  // If there is an initial value
  if (initval !== null && typeof initval !== 'undefined') {
    if ($$.isFunction(normalize)) {
      formFieldOptions.defaultValue = normalize(initval);
    } else {
      formFieldOptions.defaultValue = initval;
    }
  }

  // If there are rules
  if (rules && rules.length) {
    formFieldOptions.rules = rules;
  }

  // If you need onChange
  if (typeof onChange === 'function') {
    formFieldOptions.onChange = (value, rows) => onChange(form, value, rows); // form, value
  }

  const props = {
    placeholder: placeholder || `Please choose ${otherProps.title}`,
    ...otherProps
  };

  return (
    <TableControlled
      dataSource={dataSource}
      rowKey={rowKey || name}
      {...props}
    />
  );
};
