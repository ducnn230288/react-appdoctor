import React from 'react';
import { Upload } from 'antd';
import PropTypes from 'prop-types';
import $$ from 'cmn-utils';

import config from '@/config';

// Get parameters from the global configuration
const request = config.request || {};

/**
 * Enable Upload to take the global proxy and carry global header information
 */
class uiUpload extends React.PureComponent {
  render() {
    const { headers, action, value, fileTypes, maxFileSize, max,...otherProps } = this.props;
    let newheaders = { ...headers };

    const uploadProps = { ...otherProps };

    if (request && request.withHeaders) {
      if ($$.isFunction(request.withHeaders)) {
        newheaders = { ...request.withHeaders(), ...newheaders };
      } else if ($$.isObject(request.withHeaders)) {
        newheaders = { ...request.withHeaders, ...newheaders };
      }
      uploadProps.headers = newheaders;
    }

    let nextURL = (request.prefix || '') + action;
    if (/^(http|https|ftp):\/\//.test(action)) {
      nextURL = action;
    }

    if (action) {
      uploadProps.action = nextURL;
    }
    if (value) {
      uploadProps.fileList = value;
    }

    uploadProps.beforeUpload = (file, fileList) => {
      let bool = true;
      if (value && max) {
        bool = (value.length + fileList.length) <= max
      }
      if (maxFileSize && bool) {
        bool = !(file.size > maxFileSize * 1024)
      }
      if (fileTypes && bool) {
        bool = fileTypes.some(
          type => file.name.toLowerCase().indexOf(type.toLowerCase()) !== -1
        )
      }
      return bool;
    }
    
    return <Upload {...uploadProps} />;
  }
}

uiUpload.propTypes = {
  headers: PropTypes.object,
  action: PropTypes.string,
};

export default uiUpload;
