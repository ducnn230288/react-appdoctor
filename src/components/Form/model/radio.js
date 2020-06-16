import React from 'react';
import { Radio } from 'antd';
import $$ from 'cmn-utils';

const RadioGroup = Radio.Group;
/**
 * Single box
 */
export default ({
  name,
  dict = [],
  formFieldOptions = {},
  record,
  initialValue,
  rules,
  onChange,
  normalize,
  buttonStyle,
  getPopupContainer,
  preview,
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

  // Preview view
  if (preview) {
    const dictObj = dict.filter(item => item.code === initval)[0];
    let text = '';
    if (dictObj) {
      text = dictObj.codeName;
    }
    return <div style={otherProps.style}>{text}</div>;
  }

  // If there are rules
  if (rules && rules.length) {
    formFieldOptions.rules = rules;
  }

  // If you need onChange
  if (typeof onChange === 'function') {
    formFieldOptions.onChange = e => onChange(e.target.value, e); // value
  }

  let RadioComp = Radio;
  if (buttonStyle === 'solid') RadioComp = Radio.Button;

  return (
    <RadioGroup {...otherProps}>
      {dict.map((dic, i) => (
        <RadioComp key={dic.code} value={dic.code} title={dic.codeName}>
          {dic.codeName}
        </RadioComp>
      ))}
    </RadioGroup>
  );
};
