import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Transfer, Modal, Select } from 'antd';
import intl from "react-intl-universal";

import messages from '../messages';

const { Option } = Select;
/**
 *  formItem: {
      type: 'transfer',
      modal: true,
      dataSource: employees,
      normalize: (value) => value.map(item => item.key)
    }
 */
class TransferControlled extends Component {
  constructor(props) {
    super(props);
    const { dataSource, initialValues } = props;
    this.state = {
      value: initialValues || [],
      dataSource: dataSource,
      visible: false
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.initialValues !== prevProps.initialValues) {
      this.setState({ value: this.props.initialValues });
    }
  }

  triggerChange = (nextTargetKeys, direction, moveKeys) => {
    const { modal, onChange } = this.props;
    this.setState({ value: nextTargetKeys });

    if (onChange && !modal) {
      onChange(nextTargetKeys);
    }
  };

  showModal = () => {
    this.setState({
      visible: true,
      value: this.props.value
    });
  };

  hideModal = () => {
    this.setState({
      visible: false
    });
  };

  onSubmit = () => {
    const { onChange } = this.props;
    const { value } = this.state;
    this.setState({
      visible: false
    });
    if (onChange) {
      onChange(value);
    }
  };

  onSelectChange = (value, option) => {
    const { onChange } = this.props;
    this.setState({
      value
    });
    onChange && onChange(value);
  };

  render() {
    const { title, modal, placeholder, ...otherProps } = this.props;
    const { dataSource, value, visible } = this.state;

    const comp = (
      <Transfer
        {...otherProps}
        dataSource={dataSource}
        titles={[intl.formatMessage(messages.source), intl.formatMessage(messages.aims)]}
        targetKeys={value}
        onChange={this.triggerChange}
        render={item => item.title || item.label}
      />
    );
    if (modal || otherProps.disabled) {
      return (
        <div>
          <div onClick={otherProps.disabled ? () => {} : this.showModal}>
            <Select
              readOnly
              disabled={!!otherProps.disabled}
              mode="multiple"
              open={false}
              value={otherProps.value}
              onChange={this.onSelectChange}
              placeholder={placeholder}
            >
              {otherProps.value &&
                dataSource
                  .filter(item => otherProps.value.indexOf(item.key) !== -1)
                  .map(item => (
                    <Option key={item.key} value={item.key}>
                      {item.title || item.label}
                    </Option>
                  ))}
            </Select>
          </div>
          <Modal
            className="antui-transfer-modal"
            title={'Please choose ' + title}
            visible={visible}
            onOk={this.onSubmit}
            onCancel={this.hideModal}
            okText= {intl.formatMessage(messages.save)}
            cancelText= {intl.formatMessage(messages.cancel)}
            {...modal}
          >
            {comp}
          </Modal>
        </div>
      );
    }

    return comp;
  }
}

TransferControlled.propTypes = {
  value: PropTypes.array,
  dataSource: PropTypes.array,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  title: PropTypes.string,
  modal: PropTypes.any,
};

/**
 * TransferForm component
 */
export default ({
  name,
  formFieldOptions = {},
  record,
  defaultValue,
  rules,
  onChange,
  dataSource,
  normalize,
  placeholder,
  getPopupContainer,
  ...otherProps
}) => {

  let initval = defaultValue;

  if (record) {
    initval = record[name];
  }

  // If you need onChange
  if (typeof onChange === 'function') {
    formFieldOptions.onChange = value => onChange(value);
  }

  const props = {
    placeholder: placeholder || `Please choose ${otherProps.title}`,
    initialValues: initval,
    ...otherProps
  };

  return <TransferControlled dataSource={dataSource} {...props} />;
};
