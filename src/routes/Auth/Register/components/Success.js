import React, { Component, Fragment } from 'react';
import intl from 'react-intl-universal';
import { Layout, Button } from 'antd';

import { Result } from 'components/Pages';
import messages from '../messages';
const { Content } = Layout;

export default class extends Component {
  render() {
    const actions = (
      <Fragment>
        <Button type="primary">{intl.formatMessage(messages.viewMailbox)}</Button>
        <Button href="/">{intl.formatMessage(messages.backToHome)}</Button>
      </Fragment>
    );

    const footer = (
      <Fragment>
        <p>
          <span>Need More Help?</span>
        </p>
        <p>
          Misc question two? <span>Response Link</span>
        </p>
      </Fragment>
    );

    const extra = <div>Yoursite.com</div>;
    
    return (
      <Layout className="full-layout result-page">
        <Content>
          <Result
            title={intl.formatMessage(messages.registrationSuccess)}
            type="success"
            actions={actions}
            footer={footer}
            extra={extra}
          >
            {intl.formatMessage(messages.textRegister)}
          </Result>
        </Content>
      </Layout>
    );
  }
}
