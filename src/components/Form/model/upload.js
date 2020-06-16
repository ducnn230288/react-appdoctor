import React from 'react';
import { Button } from 'antd';
import intl from 'react-intl-universal';

import Upload from 'components/Upload';

import messages from '../messages';
/**
 * Upload component, you may need to process the inverse value yourself, if FormData is needed in the background
 * const formData = new FormData();
   fileList.forEach((file) => {
     formData.append('files[]', file);
   });
 */
export default ({
  form,
  name,
  formFieldOptions = {},
  record,
  normalize,
  rules,
  onChange,
  type,
  preview,
  renderUpload,
  btnIcon = 'las la-upload',
  action, // Background address
  fileName, // The name attribute of antd upload, because name is used by formItem, the file name uploaded to the background
  getPopupContainer,
  ...otherProps
}) => {

  // If you need onChange
  if (typeof onChange === 'function') {
    formFieldOptions.onChange = args => onChange(form, args); // form, args
  }

  let uploadProps = {
    beforeUpload: file => false,
    ...otherProps
  };

  // Really upload to the background
  if (action) {
    uploadProps = otherProps;
    uploadProps.action = action;
    uploadProps.name = fileName || 'file';
  }

  return (
    <Upload {...uploadProps}>
      {renderUpload ? renderUpload(form, record) : (
        <Button icon={<i className={btnIcon} />}>
          {intl.formatMessage(messages.clickUpload)}
        </Button>
      )}
    </Upload>
  );
};