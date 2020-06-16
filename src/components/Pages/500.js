import React from 'react';
import { router } from 'dva';
import { Layout, Row, Col } from 'antd';
import intl from 'react-intl-universal';

import messages from './messages';
import errorImg from './style/images/error.gif';

const { Link } = router;
const { Content } = Layout;

export default () => (
  <Layout className="full-layout page500">
    <Content>
      <Row className="error-block">
        <Col xs={24} md={16}>
          <div className="center-block">
            <h1 className="error-title"> 500! </h1>
            <h2 className="error-subtitle"> {intl.formatMessage(messages.unexpectedMistake)}</h2>
            <h6>{intl.formatMessage(messages.errorCode)} 500</h6>
          </div>
        </Col>
        <Col xs={24} md={8}>
          <img src={errorImg} width="290" alt="error" />
        </Col>
      </Row>
      <Link to="/" className="backhome">
        <i className="las la-home" />
      </Link>
    </Content>
  </Layout>
);
