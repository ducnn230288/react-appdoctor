import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button, message, Form } from 'antd';
import cx from 'classnames';
import $$ from 'cmn-utils';
import intl from "react-intl-universal";

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
 * Search bar
 */
class SearchBar extends React.Component {
  // When type is grid, specify the number of elements in each row
  cols = {
    xs: 8,
    md: 6,
    xl: 4
  };

  // Inline element default width
  width = {
    date: 100,
    month: 100,
    'date~': 210,
    datetime: 140,
    select: 100,
    default: 110,
    treeSelect: 110,
    cascade: 110,
    cascader: 110
  };

  // When the type is grid, specify the interval between every two elements
  rows = {
    gutter: 8
  };

  resetForm(e) {
    this.refs.form.resetFields();
    this.searchForm(true);
  }

  async searchForm(isReset) {
    try {
      const values = await this.refs.form.validateFields()
      this.props.onSearch && this.props.onSearch(values, isReset);
    } catch (errors) {
      let errs = [];
      Object.keys(errors).forEach(fieldName => {
        errs = errors[fieldName].errors || [];
      });
      if (errs && errs.length) message.error(errs[0].message);
    }
  }

  render() {
    const {
      className,
      prefixCls,
      type,
      rows,
      cols,
      columns,
      group,
      children,
      form,
      appendTo,
      record,
      ...otherProps
    } = this.props;

    const colopts = type === 'grid' ? cols || this.cols : {};
    const rowopts = type === 'grid' ? rows || this.rows : {};

    let ComponentRow = type === 'inline' ? PlainComp : Row;
    let ComponentCol = type === 'inline' ? PlainComp : Col;
    let ComponentItem = Form.Item;
    const formItemLayout =
      type === 'grid'
        ? {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
          }
        : {};

    let ComponentBtnGroup = type === 'inline' ? Button.Group : PlainComp;

    let searchFields = columns.filter(col => col.searchItem);
    searchFields = group
      ? searchFields.filter(
          col => col.searchItem && col.searchItem.group === group
        )
      : searchFields;

    if (!searchFields.length) return null;

    delete otherProps.onSearch;

    let getPopupContainer = null;
    if (appendTo) {
      if ($$.isFunction(appendTo)) getPopupContainer = appendTo;
      else if (appendTo === true)
        getPopupContainer = triggerNode => triggerNode.parentNode;
      else getPopupContainer = _ => appendTo;
    }

    return (
      <div className={cx(prefixCls, className)} {...otherProps}>
        <Form
          ref="form"
          initialValues={record}
          className={cx({
            'form-inline': type === 'inline',
            'form-grid': type === 'grid'
          })}
        >
          <ComponentRow className="row-item" {...rowopts}>
            {searchFields.map((field, i) => {
              let col = { ...colopts };
              if (type === 'grid' && field.searchItem.col) {
                col = field.searchItem.col;
              } else if (type !== 'grid') {
                col = {};
              }

              const fieldType = field.searchItem.type || 'input';

              const formProps = {
                form: this.refs,
                name: field.name,
                title: field.title,
                record,
                ...field.searchItem
              };

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

              let FieldComp;
              switch (fieldType) {
                case 'date~': // Date range
                case 'datetime': // Date time
                case 'date': // Date
                case 'month': // Month
                case 'time': // Time
                  FieldComp = require(`../Form/model/date`).default(formProps);
                  break;
                case 'input': // Input box
                case 'textarea': // Multi-line text
                  formProps.autoComplete = 'off';
                  FieldComp = require(`../Form/model/input`).default(formProps);
                  break;
                case 'hidden': // Hidden domain
                  return (
                    <span key={`col-${i}`}>
                      {require(`../Form/model/input`).default(formProps)}
                    </span>
                  );
                default:
                  // General purpose
                  FieldComp = require(`../Form/model/${fieldType.toLowerCase()}`).default(
                    formProps
                  );
              }

              return (
                <ComponentCol key={`col-${i}`} className="col-item" {...col}>
                  <ComponentItem
                    {...formItemLayout}
                    {...formProps}
                    label={field.title}
                    name={field.name}
                    noStyle={type === 'inline'}
                    className="col-item-content"
                  >
                    {FieldComp}
                  </ComponentItem>
                </ComponentCol>
              );
            })}
            {children}
          </ComponentRow>
          <ComponentBtnGroup className="search-btns">
            <Button
              title={intl.formatMessage(messages.titleButtonTop)}
              type={type === 'grid' ? 'primary' : 'default'}
              onClick={e => this.searchForm()}
              htmlType="submit"
              icon={<i className="las la-search" />}
            >
              {intl.formatMessage(messages.titleButtonTop)}
            </Button>
            <Button title={intl.formatMessage(messages.titleButtonBottom)} onClick={e => this.resetForm()} icon={<i className="las la-redo-alt" />}>
              {intl.formatMessage(messages.titleButtonBottom)}
            </Button>
          </ComponentBtnGroup>
        </Form>
      </div>
    );
  }
}

SearchBar.propTypes = {
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
   * Search bar type inline (inline), grid (grid)
   */
  type: PropTypes.string,
  /**
   * Group search conditions. After setting this property, search items with the same group value will be filtered in column.js
   */
  group: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /**
   * Row configuration in the Grid component in the same antd
   */
  rows: PropTypes.object,
  /**
   * Col configuration in Grid component in antd
   */
  cols: PropTypes.object,
  /**
   * Additional search terms
   */
  children: PropTypes.node,
  /**
   * How to deal with items with pop-up boxes in the form, such as drop-down box, drop-down tree, date selection, etc.
   * Set to true will automatically attach to the form, or use function to specify
   * For usage, see antd's getPopupContainer property with pop-up component http://ant-design.gitee.io/components/select/
   * appendTo={triggerNode => triggerNode.parentNode}
   */
  appendTo: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),

  form: PropTypes.object,

  /**
   * Click the query button onSearch (values, isReset) values to query whether the data isReset is reset
   */
  onSearch: PropTypes.func
};

SearchBar.defaultProps = {
  prefixCls: 'antui-searchbar',
  type: 'inline'
};

export default SearchBar;
