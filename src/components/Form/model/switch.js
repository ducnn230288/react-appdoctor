import React from 'react';
import { Switch } from 'antd';

/**
 * Single box
 */
export default ({
  initialValue,
  record,
  name,
  ...otherProps
}) => {
  let checked = initialValue;

  if (record) {
    checked = record[name];
  }


  return (
    <Switch
      checkedChildren={<i className="las la-check" />}
      unCheckedChildren={<i className="las la-times" />}
      checked={checked}
    />
  );
};
