import React from 'react';
import { InputNumber } from 'antd';
import $$ from 'cmn-utils';

/**
 * Digital input frame component
 */
export default ({
  form,
  name,
  formFieldOptions = {},
  initialValue,
  normalize,
  rules,
  onChange,
  preview,
  placeholder,
  getPopupContainer,
  type,
  ...otherProps
}) => {
  let initval = initialValue;

  // If there is an initial value
  if (initval !== null && typeof initval !== 'undefined') {
    if ($$.isFunction(normalize)) {
      formFieldOptions.initialValue = normalize(initval);
    } else {
      formFieldOptions.initialValue = initval;
    }
  }

  if (preview) {
    return <div style={otherProps.style}>{initval || ''}</div>;
  }

  // If there are rules
  if (rules && rules.length) {
    formFieldOptions.rules = rules;
  }

  // If you need onChange
  if (typeof onChange === 'function') {
    formFieldOptions.onChange = value => onChange(form, value); // form, value, event
  }

  delete otherProps.render;

  const props = {
    placeholder: placeholder || `Please enter ${otherProps.title}`,
    ...otherProps
  };

  return <InputNumber {...props} />;
};
