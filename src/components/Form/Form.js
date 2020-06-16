import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button, Divider, Form } from 'antd';
import cx from 'classnames';
import objectAssign from 'object-assign';
import $$ from 'cmn-utils';
import omit from 'object.omit';
import intl from 'react-intl-universal';

import Password from './model/password';
import messages from './messages';

import './style/index.less';

const PlainComp = ({ className, children }) => (
  <div className={className}>{children}</div>
);
PlainComp.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node
};

/**
 * Form component
 */
class FormComp extends React.Component {
  // When type is grid, specify the number of elements in each row
  cols = {
    xs: 24,
    md: 24,
    xl: 24
  };

  // Inline element default width
  width = {
    date: 100,
    month: 100,
    'date~': 210,
    datetime: 140,
    select: 100,
    default: 100,
    treeSelect: 110,
    cascade: 110,
    cascader: 110
  };

  // Specify the interval between every two elements when type is grid
  rows = {
    gutter: 8
  };

  onReset = e => {
    this.refs.form.resetFields();
  };

  onSubmit = values => {
    const { record, onSubmit } = this.props;
    onSubmit && onSubmit(values, record);
  };

  render() {
    const {
      className,
      prefixCls,
      type,
      rows,
      cols,
      formItemLayout: _formItemLayout,
      layout,
      appendTo,
      columns,
      record,
      group,
      children,
      preview,
      loading,
      footer,
      ...otherProps
    } = this.props;

    delete otherProps.onSubmit;

    let classname = cx(prefixCls, className, {
      'form-inline': type === 'inline',
      'form-grid': type === 'grid',
      preview: preview
    });

    const colopts = type === 'grid' ? cols || this.cols : {};
    const rowopts = type === 'grid' ? rows || this.rows : {};

    let ComponentRow = type === 'inline' ? PlainComp : Row;
    let ComponentCol = type === 'inline' ? PlainComp : Col;
    let ComponentItem = Form.Item;

    let formFields = columns.filter(col => col.formItem);
    formFields = group
      ? formFields.filter(col => col.formItem && col.formItem.group === group)
      : formFields;

    let getPopupContainer = null;
    if (appendTo) {
      if ($$.isFunction(appendTo)) getPopupContainer = appendTo;
      else if (appendTo === true)
        getPopupContainer = triggerNode => triggerNode.parentNode;
      else getPopupContainer = _ => appendTo;
    }

    return (
      <Form
        ref="form"
        className={classname}
        initialValues={record}
        onFinish={this.onSubmit}
        scrollToFirstError={true}
        {...objectAssign(otherProps, type === 'inline' && { layout: 'inline' })}
      >
        <ComponentRow className="row-item" {...rowopts}>
          {formFields.map((field, i) => {
            // Pass in the personalized column size, change this value to change the number of elements per line
            let col = { ...colopts };
            if (type === 'grid' && field.formItem.col) {
              col = field.formItem.col;
            } else if (type !== 'grid') {
              col = {};
            }

            let formItemLayout = { ..._formItemLayout, ...layout };
            if (
              type === 'grid' &&
              (field.formItem.formItemLayout || field.formItem.layout)
            ) {
              formItemLayout = {
                ...formItemLayout,
                ...field.formItem.formItemLayout,
                ...field.formItem.layout
              };
            } else if (type !== 'grid') {
              formItemLayout = {};
            }

            const fieldType = field.formItem.type || 'input';

            let formProps = {
              name: field.name,
              title: field.title,
              record,
              preview,
              ...field.formItem
            };

            const itemFormProps = {
              rules: field.formItem.rules || []
            }

            if (type === 'inline') {
              formProps.style = {
                width: formProps.width || this.width[fieldType]
              };
            }

            if (getPopupContainer) {
              formProps.getPopupContainer = getPopupContainer;
            }

            if (field.dict) {
              formProps.dict = field.dict;
            }

            // Remove useless attributes before passing in child components
            formProps = omit(formProps, ['formItemLayout', 'layout', 'col']);

            let FieldComp;
            switch (fieldType) {
              case 'time~': // Time range
              case 'date~': // Date range
              case 'datetime': // Date and time
              case 'date': // Date
              case 'month': // Month
              case 'time': // Time
                FieldComp = require(`./model/date`).default(formProps);
                break;
              case 'input': // Input box
              case 'textarea': // Multiline text
                FieldComp = require(`./model/input`).default(formProps);
                break;
              case 'hidden': // Hidden domain
                return (
                  <span key={`col-${i}`}>
                    {require(`./model/input`).default(formProps)}
                  </span>
                );
              case 'line': // Divider
                const lineProps = omit(formProps, 'type');
                return (
                  <Divider key={`col-${i}`} {...lineProps}>
                    {formProps.title}
                  </Divider>
                );
              case 'password': // password
                return (
                  <Password
                    key={`col-${i}`}
                    formItemLayout={formItemLayout}
                    col={col}
                    {...formProps}
                  />
                );
              case "upload":
                itemFormProps.getValueFromEvent = e => {
                  if (Array.isArray(e)) {
                    return e;
                  }
                  return e && e.fileList;
                };
                const { maxFileSize, fileTypes, max } = field.formItem;
                if (maxFileSize || fileTypes) {
                  itemFormProps.rules = [
                    ...(itemFormProps.rules || []),
                    ({ getFieldValue }) => ({
                      validator: (rule, value, callback) => {
                        let msg;
                        if (max) {
                          msg = validatorMaxFile(max, value);
                        }
                        if (maxFileSize && !msg) {
                          msg = validatorFileSize(maxFileSize, value, callback);
                        }
                        if (fileTypes && !msg) {
                          msg = validatorFileTypes(fileTypes, value, callback);
                        }
                        if (msg) {
                          return Promise.reject(msg);
                        }
                        return Promise.resolve();
                      }
                    }),
                  ];
                }
                FieldComp = require(`./model/upload`).default(formProps);
                break;
              default:
                // General
                FieldComp = require(`./model/${fieldType.toLowerCase()}`).default(
                  formProps
                );
            }

            return (
              <ComponentCol key={`col-${i}`} className="col-item" {...col}>
                <ComponentItem
                  {...formItemLayout}
                  {...itemFormProps}
                  label={field.title}
                  name={field.name}
                  className="col-item-content"
                  validateTrigger={['onChange', 'onBlur']}
                >
                  {FieldComp}
                </ComponentItem>
              </ComponentCol>
            );
          })}
          {children}
          {footer === undefined ? (
            <ComponentCol className="form-btns col-item" {...colopts}>
              <Button
                title={intl.formatMessage(messages.submit)}
                type="primary"
                htmlType="submit"
                icon={<i className="las la-check" />}
                loading={loading}
              >
                {intl.formatMessage(messages.submit)}
              </Button>
              <Button
                title={intl.formatMessage(messages.reset)}
                onClick={e => this.onReset()} icon={<i className="las la-redo-alt" />}
              >
                {intl.formatMessage(messages.reset)}
              </Button>
            </ComponentCol>
          ) : (
            footer
          )}
        </ComponentRow>
      </Form>
    );
  }
}

export const Item = Form.Item;

FormComp.propTypes = {
  prefixCls: PropTypes.string,
  className: PropTypes.string,
  /**
   * See the help document column.js usage for details
   */
  columns: PropTypes.array.isRequired,
  /**
   * Use record data to assign values to the form {key: value, key1: value1}, the initial value of the time type needs to be converted to the moment type
   */
  record: PropTypes.object,
  /**
   * Form type inline (line), grid (grid)
   */
  type: PropTypes.string,
  /**
   * Group search conditions. After setting this property, search items with the same group value will be filtered in column.js
   */
  group: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /**
   * How to deal with items with pop-up boxes in the form, such as drop-down box, drop-down tree, date selection, etc.
   * Set to true will automatically attach to the form, or use function to specify
   * For usage, see antd's getPopupContainer property with pop-up component https://ant-design.gitee.io/components/select/
   * appendTo={triggerNode => triggerNode.parentNode}
   */
  appendTo: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  /**
   * Row configuration in the Grid component in the same antd
   */
  rows: PropTypes.object,
  /**
   * Col configuration in Grid component in antd
   */
  cols: PropTypes.object,
  /**
   * Extra form items
   */
  children: PropTypes.node,
  /**
   * Click the query button onSubmit (values) values to submit data
   */
  onSubmit: PropTypes.func,

  /**
   * Whether it is a preview view, all form items will be displayed in text mode
   */
  preview: PropTypes.bool,

  /** antd formItemLayout */
  formItemLayout: PropTypes.object,
  layout: PropTypes.object, // Same as formItemLayout

  /**
   * Is it in the submission status
   */
  loading: PropTypes.bool,

  /**
   * Whether to display the bottom button, or pass in a custom bottom button
   */
  footer: PropTypes.oneOfType([PropTypes.bool, PropTypes.node])
};

FormComp.defaultProps = {
  prefixCls: 'antui-form',
  type: 'grid',
  loading: false,
  formItemLayout: {
    labelCol: { span: 6 },
    wrapperCol: { span: 17 }
  }
};

export default FormComp;

const validatorFileSize = (maxFileSize, value, callback) => {
  if (value.some(item => item.size > maxFileSize * 1024)) {
    // return callback(new Error(`Please upload an image with a file size of ${maxFileSize}K`));
    return `Please upload an image with a file size of ${maxFileSize}K`
  }
  return null;
};

const validatorFileTypes = (fileTypes, value, callback) => {
  if ($$.isArray(fileTypes) && fileTypes.length > 0) {
    if (
      value.some(
        item =>
          item.name &&
          !fileTypes.some(
            type => item.name.toLowerCase().indexOf(type.toLowerCase()) !== -1
          )
      )
    ) {
      // return callback(new Error(`Please upload ${fileTypes.join('、')}, type file`));
      return `Please upload ${fileTypes.join('、')}, type file`
    }
  }
  return null;
};

const validatorMaxFile = (max, value) => {
  if (value && value.length > max) {
    return `Only upload ${max} files`;
  }
  return null;
}