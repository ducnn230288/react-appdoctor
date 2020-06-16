import React from 'react';
import { router } from 'dva';
import { Layout, Row, Col } from 'antd';
import intl from 'react-intl-universal';

import messages from './messages';
import errorImg from './style/images/error403.svg';

const { Link } = router;
const { Content } = Layout;

export default () => (
  <Layout className="full-layout page403">
    <Content>
      <Row className="error-block">
        <Col xs={24} md={16}>
          <div className="center-block">
            <h1 className="error-title"> 403! </h1>
            <h2 className="error-subtitle">{intl.formatMessage(messages.dontAccess)}</h2>
            <h6>{intl.formatMessage(messages.errorCode)} 403</h6>
          </div>
        </Col>
        <Col xs={24} md={8}>
          <img src={errorImg} width="280" alt="error" />
        </Col>
      </Row>
      <Link to="/" className="backhome">
        <i className="las la-home" />
      </Link>
    </Content>
  </Layout>
);
