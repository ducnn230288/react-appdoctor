import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AutoComplete, Input } from 'antd';
import $$ from 'cmn-utils';
import omit from 'object.omit';
import isEqual from 'react-fast-compare';

const { Option } = AutoComplete;

class AutoCompleteControlled extends Component {
  constructor(props) {
    super(props);
    const { value, loadData, options } = props;
    this.state = {
      value,
      options,
      loading: false
    };
    this.handleSearch = loadData ? $$.debounce(this._handleSearch, 500) : null;
  }

  componentDidUpdate(prevProps, prevState) {
    const { loadData } = this.props;
    if (
      !isEqual(this.props.options, prevProps.options) ||
      !isEqual(this.props.value, prevProps.value)
    ) {
      const newState = { value: this.props.value };
      if (!loadData && this.props.options) {
        newState.options = this.props.value ? this.props.options : [];
      }

      this.setState(newState);
    }
  }

  onSearch = value => {
    const { onChange, loadData } = this.props;
    if (onChange) {
      onChange(value, {});
    }
    if (!value.trim()) {
      this.setState({
        options: [],
        value
      });
      return;
    } else {
      this.setState({
        value
      });
    }

    if (loadData) {
      this.handleSearch(value);
    }
  };

  _handleSearch = value => {
    const { loadData } = this.props;

    this.setState({ loading: true }); // input suffix Attributes cause input interruption when input
    const promise = loadData(value);
    if (promise && promise.then) {
      promise
        .then(listItem => {
          this.setState({
            options: listItem,
            loading: false
          });
        })
        .catch(e =>
          this.setState({
            options: [],
            loading: false
          })
        );
    }
  };

  renderOptions = options => {
    const { render } = this.props;
    if (render) return render(options) || [];
    else {
      return options.map(this.renderOptionItem);
    }
  };

  renderOptionItem = (item, index) => {
    const { keyField, valueField, renderItem } = this.props;
    return (
      <Option key={item[keyField] || index} value={item[valueField] || index}>
        {!!renderItem && renderItem(item)}
      </Option>
    );
  };

  onSelect = (value, option) => {
    const { onChange } = this.props;
    if (onChange) {
      const { valueField, optionLabelProp } = this.props;
      const itemProps = option.props;
      const valueKey = valueField || optionLabelProp;
      const rvalue = itemProps[valueKey] || value;
      onChange(rvalue, option);
    }
  };

  render() {
    const { value, options, loading } = this.state;
    const autoComponentProps = omit(this.props, [
      'value',
      'onChange',
      'loadData',
      'valueField',
      'keyField',
      'renderItem',
      'options',
    ]);
    return (
      <AutoComplete
        value={value}
        defaultActiveFirstOption={false}
        onSelect={this.onSelect}
        onChange={this.onSearch}
        filterOption={(inputValue, option) =>
          option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
        }
        {...autoComponentProps}
        allowClear={false}
      >
        { loading ? (
        <Input
          suffix={<i className="las la-sync auto-complete-loading la-spin" />}
        />) : options.map(this.renderOptionItem)}
      </AutoComplete>
    );
  }
}

AutoCompleteControlled.propTypes = {
  value: PropTypes.any,
  options: PropTypes.array,
  optionLabelProp: PropTypes.array,
  onChange: PropTypes.func,
  keyField: PropTypes.string,
  valueField: PropTypes.string,
  render: PropTypes.func,
  renderItem: PropTypes.func,
  loadData: PropTypes.func
};

AutoCompleteControlled.defaultProps = {
  keyField: "value",
  valueField: "label",
  options: [],
};

export default ({
  name,
  formFieldOptions = {},
  record,
  initialValue,
  rules,
  onChange,
  normalize,
  getPopupContainer,
  placeholder,
  ...otherProps
}) => {

  let initval = initialValue;

  if (record) {
    initval = record[name];
  }

  // If there is an initial value
  if (initval !== null && typeof initval !== 'undefined') {
    if ($$.isFunction(normalize)) {
      formFieldOptions.initialValue = normalize(initval);
    } else {
      formFieldOptions.initialValue = initval;
    }
  }

  // If there are rules
  if (rules && rules.length) {
    formFieldOptions.rules = rules;
  }

  // If you need onChange
  if (typeof onChange === 'function') {
    formFieldOptions.onChange = (value, option) =>
      onChange(value, option); // value, option selected item
  }

  const props = {
    placeholder: placeholder || `Please enter ${otherProps.title}`,
    ...otherProps
  };

  if (getPopupContainer) {
    props.getPopupContainer = getPopupContainer;
  }

  return <AutoCompleteControlled {...props} />;
};
