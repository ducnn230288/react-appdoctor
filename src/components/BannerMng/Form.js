import React from 'react';
import PropTypes from 'prop-types';
import objectAssign from 'object-assign';

import Form from 'components/Form';

const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 16 }
};

class BannerForm extends React.Component {
  handleSubmit = values => {
    const { record, onSubmit, imageKey } = this.props;
    if (values[imageKey] && values[imageKey].length) {
      values[imageKey] =
        values[imageKey][0].url || values[imageKey][0].thumbUrl;
      onSubmit && onSubmit(objectAssign({}, record, values));
    } else {
      console.warn('not found a image field!');
    }
  };

  render() {
    const { columns, record } = this.props;
    return (
      <div className="banner-content">
        <Form
          className="banner-form"
          columns={columns}
          record={record}
          onSubmit={this.handleSubmit}
          formItemLayout={formItemLayout}
        />
      </div>
    );
  }
}

BannerForm.propTypes = {
  record: PropTypes.object,
  onSubmit: PropTypes.func,
  columns: PropTypes.array,
  imageKey: PropTypes.string,
  // onCancel: PropTypes.func
};

export default BannerForm;
