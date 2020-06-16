import React, { PureComponent } from 'react';
import { Radio } from 'antd';
import PropTypes from 'prop-types';
import intl from 'react-intl-universal';

import Mask from 'components/Mask';
import messages from './messages';

const RadioGroup = Radio.Group;

/**
 * Full screen search
 */
class SearchBox extends PureComponent {
  render() {
    const { visible, onClose } = this.props;
    return (
      <Mask visible={visible} onClose={onClose} className="search-box" closable>
        <div className="search-box-input">
          <input ref="input" type="text" placeholder={intl.formatMessage(messages.searchFor)} />
          <button className="search-box-btn"><i className="las la-search" /></button>
        </div>
        <div className="search-box-content">
          <RadioGroup name="radiogroup" defaultValue={1}>
            <Radio value={1}>{intl.formatMessage(messages.user)}</Radio>
            <Radio value={2}>{intl.formatMessage(messages.department)}</Radio>
            <Radio value={3}>{intl.formatMessage(messages.article)}</Radio>
            <Radio value={4}>{intl.formatMessage(messages.all)}</Radio>
          </RadioGroup>
        </div>
      </Mask>
    );
  }
}

SearchBox.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
};

export default SearchBox;