import React, { Component } from 'react';
import PropTypes from 'prop-types';
import JoditEditor from "jodit-react";
import $$ from 'cmn-utils';

import defaultConfig from './config';
import './style/index.less';

const { debounce } = $$;

class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value
    };
    // Set this value to control the synchronization speed. If the speed is too fast, it will affect the input experience. If it is too slow, the old value may be obtained.
    // If the experience is too bad, it is recommended not to return the value, use onLoaded to get the wangeditor instance
    this._onChange = debounce(this.onChange, 2000);
  }

  // componentDidMount() {
  // }
  //
  // componentDidUpdate(prevProps, prevState) {
  // }

  onChange = html => {
    const { onChange } = this.props;
    if (onChange) onChange(html);
  };

  render() {
    const { value } = this.state;
    return (
      <JoditEditor
        ref="editor"
        value={value}
        config={defaultConfig}
        tabIndex={1} // tabIndex of textarea
        onChange={this.onChange}
      />
    );
  }
}

Editor.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  otherProps: PropTypes.any,
};


export default Editor;
