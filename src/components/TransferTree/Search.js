import React from 'react';
import { Input } from 'antd';
import PropTypes from 'prop-types';

import $$ from 'cmn-utils';

class Search extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
    this.onChange = $$.debounce(props.onChange, 500);
  }

  handleChange = value => {
    const onChange = this.props.onChange;
    if (onChange) {
      this.onChange(value);
    }
    this.setState({
      value
    })
  };

  handleClear = e => {
    e.preventDefault();

    const handleClear = this.props.handleClear;
    if (handleClear) {
      handleClear(e);
    }
    this.setState({
      value: ''
    })
  };

  render() {
    const { placeholder, prefixCls } = this.props;
    const icon =
      this.state.value && this.state.value.length > 0 ? (
        <button className={`${prefixCls}-action`} onClick={this.handleClear}>
          <i className="las la-times-circle" />
        </button>
      ) : (
        <span className={`${prefixCls}-action`}>
          <i className="las la-search" />
        </span>
      );
    return (
      <div>
        <Input
          placeholder={placeholder}
          className={prefixCls}
          value={this.state.value}
          ref="input"
          onChange={e => this.handleChange(e.target.value)}
        />
        {icon}
      </div>
    );
  }
}

Search.propTypes = {
  placeholder: PropTypes.string,
  prefixCls: PropTypes.string,
  onChange: PropTypes.func,
  handleClear: PropTypes.func,
};

Search.defaultProps = {
  placeholder: ''
};

export default Search;