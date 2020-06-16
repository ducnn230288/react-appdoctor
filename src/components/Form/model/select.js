import React from 'react';
import { Select } from 'antd';
import $$ from 'cmn-utils';
/**
 * Drop-down menu component
 */
export default ({
  name,
  dict = [],
  formFieldOptions = {},
  defaultValue,
  rules,
  onChange,
  normalize,
  getPopupContainer,
  placeholder,
  preview,
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

  // Preview view
  if (preview) {
    const _initval = $$.isArray(initval) ? initval : [initval];
    const dictObj = dict.filter(item => _initval.indexOf(item.code) !== -1);
    let text = '';
    if (dictObj.length) {
      text = dictObj.map(item => item.codeName).join(',');
    }
    return <div style={otherProps.style}>{text}</div>;
  }

  // If there are rules
  if (rules && rules.length) {
    formFieldOptions.rules = rules;
  }

  // If you need onChange
  if (typeof onChange === 'function') {
    formFieldOptions.onChange = value => onChange(value); // value
  }

  const props = {
    placeholder: placeholder || `Please choose ${otherProps.title}`,
    showSearch: true,
    optionFilterProp: 'title',
    ...otherProps
  };

  if (getPopupContainer) {
    props.getPopupContainer = getPopupContainer;
  }

  return (
    <Select {...props}>
      {dict.map((dic, i) => (
        <Select.Option key={dic.code} value={dic.code} title={dic.codeName}>
          {dic.codeName}
        </Select.Option>
      ))}
    </Select>
  );
};
