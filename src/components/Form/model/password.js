import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Col, Form } from 'antd';
import intl from 'react-intl-universal';

import messages from '../messages';
/**
 * Password control
 */
class PasswordForm extends Component {
  state = {
    confirmDirty: false
  };

  handleConfirmBlur = e => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  checkPassword = (value, name, getFieldValue) => {
    if (value && value !== getFieldValue(name)) {
      return Promise.reject(intl.formatMessage(messages.twoPasswords));
    }
    return Promise.resolve();
  };

  checkConfirm = (value, name, validateFields, confirmDirty) => {
    if (value && confirmDirty) {
      validateFields([name + '_repeat'], { force: true });
    }
    return Promise.resolve();
  };

  render() {
    const {
      name,
      formFieldOptions = {},
      rules,
      placeholder,
      type,
      formItemLayout,
      col,
      repeat,
      getPopupContainer,
      ...otherProps
    } = this.props;


    // If there are rules
    formFieldOptions.rules = [
      {
        required: true,
        message: `${intl.formatMessage(messages.pleaseEnter)} ${otherProps.title}`
      },
      {
        min: 6,
        message: intl.formatMessage(messages.passwordMin)
      },
      ({ validateFields }) => {
        const { checkConfirm, state } = this;
        const { confirmDirty } = state;
        return { validator(rule, value) {
          return checkConfirm(value, name, validateFields, confirmDirty);
        }}
      }
    ];

    // If there are rules
    if (rules && rules.length) {
      formFieldOptions.rules = formFieldOptions.rules.concat(rules);
    }

    let ComponentCol = type === 'inline' ? 'div' : Col;

    return (
      <>
        <ComponentCol className="col-item col-item-password" {...col}>
          <Form.Item
            {...formItemLayout}
            {...formFieldOptions}
            name={name + ""}
            label={otherProps.title}
            hasFeedback
            className="col-item-content"
            validateTrigger={['onChange', 'onBlur']}
          >
            <Input.Password
              type="password"
              placeholder={placeholder || `Please enter ${otherProps.title}`}
            />
          </Form.Item>
        </ComponentCol>
        {repeat ? (
          <ComponentCol className="col-item col-item-repeat-password" {...col}>
            <Form.Item
              {...formItemLayout}
              name={name + '_repeat'}
              label={'Confirm ' + otherProps.title}
              hasFeedback
              className="col-item-content"
              rules={[
                {
                  required: true,
                  message: `Please enter again ${otherProps.title}`
                },
                ({ getFieldValue }) => {
                  const { checkPassword } = this;
                  return { validator(rule, value) {
                    return checkPassword(value, name, getFieldValue);
                  }}
                }
              ]}
              validateTrigger={['onChange', 'onBlur']}
            >
              <Input.Password
                type="password"
                onBlur={this.handleConfirmBlur}
                placeholder={intl.formatMessage(messages.twoInput)}
              />
            </Form.Item>
          </ComponentCol>
        ) : null}
      </>
    );
  }
}

PasswordForm.propTypes = {
  name: PropTypes.string,
  initialValue: PropTypes.string,
  formFieldOptions: PropTypes.object,
  rules: PropTypes.array,
  placeholder: PropTypes.string,
  ComponentCol: PropTypes.node,
  ComponentItem: PropTypes.node,
  formItemLayout: PropTypes.object,
  col: PropTypes.object,
  repeat: PropTypes.bool,
  type: PropTypes.string
};

export default PasswordForm;