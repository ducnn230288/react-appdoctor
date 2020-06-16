import React from 'react';
import { TreeSelect } from 'antd';
import $$ from 'cmn-utils';

/**
 * Drop-down tree menu component
 */
export const TreeSelectForm = ({
  name,
  formFieldOptions = {},
  children,
  record,
  initialValue,
  normalize,
  rules,
  onChange,
  getPopupContainer,
  placeholder,
  ...otherProps
}) => {
  // --

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

  // If there is a rules
  if (rules && rules.length) {
    formFieldOptions.rules = rules;
  }

  // If you need onChange
  if (typeof onChange === 'function') {
    formFieldOptions.onChange = (value, label, extra) =>
      onChange(value, label, extra); // value
  }

  const props = {
    placeholder: placeholder || `Please choose ${otherProps.title}`,
    ...otherProps
  };

  if (getPopupContainer) {
    props.getPopupContainer = getPopupContainer;
  }

  return <TreeSelect {...props} />;
};

export default TreeSelectForm;
