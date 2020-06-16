import React, { Component } from 'react';
import { connect, router } from 'dva';
import { Layout, Button, Input, Checkbox, Spin, Form, Typography, Row, Col, Select } from 'antd';
import PropTypes from 'prop-types';
import intl from 'react-intl-universal';

import { appLocales } from 'components/LanguageProvider/i18n.js';
import routerLinks from "@/utils/routerLinks";
import messages from '../messages';
import './index.less';
import logoImg from '@/assets/images/logo.svg';

const { Link } = router;
const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;
const FormItem = Form.Item;

@connect(({ login, loading, global }) => ({
  global,
  login,
  loading: loading.models.login
}))
class Login extends Component {
  handleSubmit = values => {
    const { dispatch } = this.props;
    dispatch({
      type: 'login/login',
      payload: values
    });
  };

  changeLanguage = (value) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'global/setLocale',
      payload: value
    });
  };

  render() {
    const { loading, global } = this.props;
    const { locale } = global;
    return (
      <Layout className="full-layout login-page">
        <Content>
          <Spin tip={intl.formatMessage(messages.logging)} spinning={!!loading}>
            <Form onFinish={this.handleSubmit} className="login-form" initialValues={{ userName: "admin", password: "admin", remember: true, }}>
              <div className="user-img">
                <img src={logoImg} alt="logo" />
              </div>
              <Title level={4} className="text-center">{intl.formatMessage(messages.titleSignIn)}</Title>
              <FormItem name="userName" rules={[{ required: true, message: intl.formatMessage(messages.usernameMessage) }]}>
                <Input
                  size="large"
                  prefix={<i className="las la-user" />}
                  placeholder={intl.formatMessage(messages.username)}
                />
              </FormItem>
              <FormItem name="password" rules={[{ required: true, message: intl.formatMessage(messages.passwordMessage) }]}>
                <Input
                  size="large"
                  prefix={<i className="las la-lock" />}
                  type="password"
                  placeholder={intl.formatMessage(messages.password)}
                />
              </FormItem>
              <Row justify="space-between" align="center">
                <Col>
                  <FormItem name="remember" valuePropName="checked">
                    <Checkbox>{intl.formatMessage(messages.remember)}</Checkbox>
                  </FormItem>
                </Col>
                <Col>
                  <Link className="login-form-forgot" to="#">
                    {intl.formatMessage(messages.forgot)}
                  </Link>
                </Col>
              </Row>

              <Row align="center mb-2">
                <Col>
                  <Button size="large" type="primary" htmlType="submit">
                    {intl.formatMessage(messages.signIn)}
                  </Button>
                </Col>
              </Row>

              <Row align="center">
                <Col>
                  <Select defaultValue={locale} onChange={(value) => this.changeLanguage(value)}>
                    {appLocales.map(item => (
                      <Option key={item} value={item}>{intl.formatMessage(messages[item])}</Option>
                    ))}
                  </Select>
                </Col>
              </Row>

              <Row align="center">
                <Col>
                  {intl.formatMessage(messages.newUser) + ' '}
                  <Link
                    to={routerLinks('Register')}
                  >
                    {intl.formatMessage(messages.signUp)}
                  </Link>
                </Col>
              </Row>
            </Form>
          </Spin>
        </Content>
      </Layout>
    );
  }
}

Login.propTypes = {
  loading: PropTypes.bool,
  global: PropTypes.object,
  dispatch: PropTypes.func,
};

Login.defaultProps = {
};

export default Login;
