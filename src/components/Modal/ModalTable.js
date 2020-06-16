import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'antd';
import cx from 'classnames';
import intl from 'react-intl-universal';

import LoadTable from 'components/DataTable/LoadTable';
import SearchBar from 'components/SearchBar';
import messages from './messages';

import './style/index.less';

class ModalTable extends Component {
  constructor(props) {
    super(props);
    const { value, dataItems, visible, loading } = props;
    this.state = {
      value,
      dataItems,
      visible,
      loading,
      selectedRows: [],
    };
  }

  onSearch = (values, isReset) => {
    const { tableProps } = this.props;
    tableProps.onSearch && tableProps.onSearch(values)
  };

  onOk = () => {
    const { value, selectedRows } = this.state;
    const { onSubmit } = this.props;
    if (onSubmit) {
      onSubmit(value, selectedRows);
    }
  };

  render() {
    const {
      title,
      className,
      columns,
      tableProps,
      modalProps,
      full,
      width,
      onCancel,
      onOk,
      visible,
      loading
    } = this.props;

    const classname = cx(className, 'antui-table-modal', 'antui-modalform', {
      'full-modal': full
    });

    const searchBarProps = {
      columns,
      onSearch: this.onSearch
    };

    const titleComp = title && (
      <div className="with-search-title">
        <div className="left-title">{title}</div>
        <SearchBar {...searchBarProps} />
      </div>
    );

    const _modalProps = {
      className: classname,
      confirmLoading: loading,
      visible,
      width: width || 600,
      style: { top: 20 },
      title: titleComp,
      destroyOnClose: true,
      onCancel: onCancel,
      onOk: this.onOk,
      footer: [
        <div
          key="footer-page"
          className="footer-page"
          ref={e => (this.paginationContainer = e)}
        ></div>,
        <Button key="back" onClick={onCancel}>
          {intl.formatMessage(messages.cancel)}
        </Button>,
        onOk && (
          <Button key="submit" type="primary" onClick={this.onOk}>
            {intl.formatMessage(messages.save)}
          </Button>
        )
      ],
      ...modalProps
    };

    return (
      <Modal {..._modalProps}>
        <LoadTable columns={columns} {...tableProps} />
      </Modal>
    );
  }
}

ModalTable.propTypes = {
  visible: PropTypes.bool,
  loading: PropTypes.bool,
  loadData: PropTypes.bool,
  full: PropTypes.bool,
  value: PropTypes.string,
  title: PropTypes.string,
  rowKey: PropTypes.string,
  width: PropTypes.string,
  selectType: PropTypes.string,
  className: PropTypes.string,
  dataItems: PropTypes.object,
  modalOpts: PropTypes.object,
  tableProps: PropTypes.object,
  columns: PropTypes.array,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default ModalTable;
