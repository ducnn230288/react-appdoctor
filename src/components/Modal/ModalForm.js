import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'antd';
import cx from 'classnames';
import intl from 'react-intl-universal';
import omit from 'object.omit';

import Form from 'components/Form';
import messages from './messages';

import './style/index.less';

class ModalForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.visible !== prevState.visible) {
      return {
        visible: nextProps.visible
      };
    }
    return null;
  }

  closeModal = () => {
    if (this.props.onCancel) {
      this.props.onCancel();
      return;
    }
    this.setState({
      visible: false
    });
  };

  onSubmit = async () => {
    const { record, onSubmit } = this.props;
    const form = this.refs.form.refs.form
    try {
      const values = await form.validateFields();
      onSubmit && onSubmit(values, record);
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };

  render() {
    const {
      title,
      record,
      className,
      columns,
      onCancel,
      onSubmit,
      modalOpts,
      formOpts,
      loading,
      full,
    } = this.props;

    const classname = cx(className, 'antui-modalform', { 'full-modal': full });
    const modalProps = {
      className: classname,
      visible: this.state.visible,
      style: { top: 20 },
      title: title || (record ? intl.formatMessage(messages.edit) :  intl.formatMessage(messages.new)),
      // maskClosable: true,
      destroyOnClose: true,
      onCancel: this.closeModal,
      footer: [
        onCancel && (
          <Button key="back" onClick={this.closeModal}>
            {intl.formatMessage(messages.cancel)}
          </Button>
        ),
        onSubmit && (
          <Button key="submit" type="primary" onClick={this.onSubmit} loading={loading}>
            {intl.formatMessage(messages.save)}
          </Button>
        )
      ],
      ...modalOpts
    };
    const _columns = columns.map(item => omit(item, [
      'tableItem',
      'searchItem',
    ]))
    const formProps = {
      columns: _columns,
      onSubmit,
      record,
      footer: false,
      formItemLayout: {
        labelCol: { span: 24 },
        wrapperCol: { span: 24 }
      },
      ...formOpts
    };

    return (
      <Modal {...modalProps}>
        <Form ref="form" {...formProps} />
      </Modal>
    );
  }
}

ModalForm.propTypes = {
  title: PropTypes.string,
  record: PropTypes.object,
  visible: PropTypes.bool,
  loading: PropTypes.bool,
  full: PropTypes.bool,
  preview: PropTypes.bool,
  columns: PropTypes.array,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  modalOpts: PropTypes.object,
  formOpts: PropTypes.object,
  className: PropTypes.string
};

export default ModalForm;
