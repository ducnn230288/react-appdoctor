/**
 * Custom form components,
 * If you need to use form control in the column
 * 
    return form.getFieldDecorator('xxx')(
      // ...
    );
 */
export default ({render, record, ...otherProps}) => {
  return render(record, otherProps);
};