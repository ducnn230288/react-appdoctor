import React from 'react';
import { Input } from 'antd';
import $$ from 'cmn-utils';

const { TextArea } = Input;
/**
 * Text box component
 */
export default ({
  name,
  formFieldOptions = {},
  defaultValue,
  normalize,
  rules,
  onChange,
  type,
  preview,
  placeholder,
  getPopupContainer,
  ...otherProps
}) => {

  let initval = defaultValue;

  // If there is an initial value
  if (initval !== null && typeof initval !== 'undefined') {
    if ($$.isFunction(normalize)) {
      formFieldOptions.defaultValue = normalize(initval);
    } else {
      formFieldOptions.defaultValue = initval;
    }
  }

  if (preview) {
    if (type === 'hidden') return null;
    return <div style={otherProps.style}>{initval || ''}</div>;
  }

  // If there are rules
  if (rules && rules.length) {
    formFieldOptions.rules = rules;
  }

  // If you need onChange
  if (typeof onChange === 'function') {
    formFieldOptions.onChange = e => onChange(e.target.value, e); // value, event
  }

  const Comp = type === 'textarea' ? TextArea : Input;

  delete otherProps.render;

  const props = {
    autoComplete: 'off',
    type,
    placeholder: placeholder || `Please enter ${otherProps.title}`,
    ...otherProps
  };

  return <Comp {...props} />;
};
