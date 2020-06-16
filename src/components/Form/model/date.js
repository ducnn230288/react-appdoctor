import React from 'react';
import { DatePicker, TimePicker } from 'antd';
import $$ from 'cmn-utils';
import moment from 'moment';

const { MonthPicker, RangePicker } = DatePicker;
const { RangePicker: RangePickerTime } = TimePicker;

/**
 * Date, time component
 */
export default ({
  name,
  form,
  type,
  record,
  defaultValue,
  rules,
  formFieldOptions = {},
  format,
  onChange,
  normalize,
  preview,
  getPopupContainer,
  ...otherProps
}) => {

  let initval = defaultValue;

  if (record) {
    initval = record[name];
  }

  // If there is an initial value
  if (initval !== null && typeof initval !== 'undefined') {
    if ($$.isFunction(normalize)) {
      formFieldOptions.defaultValue = normalize(initval);
    } else {
      if ($$.isArray(initval)) {
        formFieldOptions.defaultValue = initval.map(item => moment.isMoment(item) ? item : moment(item))
      } else {
        formFieldOptions.defaultValue = moment.isMoment(initval) ? initval : moment(initval);
      }
    }
  } else {
    formFieldOptions.defaultValue = null;
  }

  // If there are rules
  if (rules && rules.length) {
    formFieldOptions.rules = rules;
  }

  let Component = DatePicker;

  const props = {
    ...otherProps
  };

  if (getPopupContainer) {
    props.getCalendarContainer = getPopupContainer;
  }

  switch (type) {
    case 'date':
      break;
    case 'datetime':
      break;
    case 'date~':
      Component = RangePicker;
      break;
    case 'month':
      Component = MonthPicker;
      break;
    case 'time':
      Component = TimePicker;
      break;
    case 'time~':
      Component = RangePickerTime
      break;
    default:
      break;
  }

  // If you need onChange
  if (typeof onChange === 'function') {
    formFieldOptions.onChange = (date, dateString) =>
      onChange(form, date, dateString);
  }

  if (format) props.format = format;
  else if (type === 'month') props.format = 'YYYY-MM';
  else if (type === 'datetime' || type === 'date~')
    props.format = 'YYYY-MM-DD HH:mm:ss';
  else if (type === 'time' || type === 'time~') props.format = 'HH:mm:ss';
  else props.format = 'YYYY-MM-DD';

  if (preview) {
    return (
      <div style={otherProps.style}>
        {initval ? formFieldOptions.initialValue.format(props.format) : ''}
      </div>
    );
  }

  return <Component {...props} />;
};
