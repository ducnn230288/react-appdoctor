import React, { Component } from 'react';
import { connect, router } from 'dva';
import { Input, Button, Select, Row, Col, Popover, Progress, Layout, Form, Typography, Checkbox } from 'antd';
import intl from 'react-intl-universal';

import routerLinks from "@/utils/routerLinks";
import Success from './Success';
import messages from '../messages';

import logoImg from 'assets/images/logo.svg';
import './index.less';
import '../../Login/components/index.less';

const { Link } = router;
const { Content } = Layout;

const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;
const { Title } = Typography;

const passwordStatusMap = {
  ok: <div style={{ color: '#52c41a' }}>Strength: Strong</div>,
  pass: <div style={{ color: '#faad14' }}>Strength: Medium</div>,
  poor: <div style={{ color: '#f5222d' }}>Strength: Too Short</div>
};

const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception'
};

@connect(({ register, loading }) => ({
  register,
  submitting: loading.effects['register/submit']
}))
class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      confirmDirty: false,
      visible: false,
      registerSuccess: false
    };
  }


  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.register.status) {
      return {
        registerSuccess: true
      };
    }
    return null;
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  onGetCaptcha = () => {
    let count = 59;
    this.setState({ count });
    this.interval = setInterval(() => {
      count -= 1;
      this.setState({ count });
      if (count === 0) {
        clearInterval(this.interval);
      }
    }, 1000);
  };

  getPasswordStatus = () => {
    const { form } = this.refs;
    if (form) {
      const value = form.getFieldValue('password');
      if (value && value.length > 9) {
        return 'ok';
      }
      if (value && value.length > 5) {
        return 'pass';
      }
    }
    return 'poor';
  };

  handleSubmit = values => {
    const { dispatch } = this.props;
    this.setState({
      visible: false
    });
    dispatch({
      type: 'register/submit',
      payload: {
        ...values,
      }
    });
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    const { confirmDirty } = this.state;
    this.setState({ confirmDirty: confirmDirty || !!value });
  };

  checkConfirm = (value, getFieldValue) => {
    if (value && value !== getFieldValue('password')) {
      return Promise.reject(intl.formatMessage(messages.passwordsTwice));
    } else {
      return Promise.resolve();
    }
  };

  checkPassword = (value, validateFields) => {
    if (!value) {
      this.setState({
        visible: !!value
      });
      return Promise.reject(intl.formatMessage(messages.enterPassword));
    } else {
      const { visible, confirmDirty } = this.state;
      if (!visible) {
        this.setState({
          visible: !!value
        });
      }
      if (value.length < 6) {
        return Promise.reject(intl.formatMessage(messages.placeholderPassword));
      } else {
        if (value && confirmDirty) {
          validateFields(['confirm'], { force: true });
        }
      }
    }
    return Promise.resolve();
  };

  renderPasswordProgress = () => {
    const { form } = this.refs;
    const passwordStatus = this.getPasswordStatus();
    if (form) {
      const value = form.getFieldValue('password');
      return (value && value.length) ? (
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={`progress-${passwordStatus}`}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      ) : null;
    }
    return null;
  };

  render() {
    const { submitting } = this.props;
    const { count, visible, registerSuccess } = this.state;

    if (registerSuccess) {
      return <Success />;
    }
    return (
      <Layout className="full-layout register-page login-page">
        <Content>
          <Form
            onFinish={this.handleSubmit}
            scrollToFirstError
            ref="form"
            name="basic"
            className="login-form"
            initialValues={{prefix: "86"}}
          >
            <div className="user-img">
              <img src={logoImg} alt="logo" />
            </div>
            <Title level={4} className="text-center">{intl.formatMessage(messages.titleSignUp)}</Title>
            <FormItem
              name="mail"
              rules={[
                {required: true, message: intl.formatMessage(messages.messageEmail)},
                {type: 'email',message: intl.formatMessage(messages.messageEmailFormat)}
              ]}
              validateTrigger={['onChange', 'onBlur']}
            >
              <Input placeholder={intl.formatMessage(messages.email)} />
            </FormItem>
            <Popover
              overlayClassName="popover-register-page"
                content={
                  <div style={{ padding: '4px 0' }}>
                    {passwordStatusMap[this.getPasswordStatus()]}
                    {this.renderPasswordProgress()}
                    <div style={{ marginTop: 10 }}>
                      {intl.formatMessage(messages.checkPassword)}
                    </div>
                  </div>
                }
                overlayStyle={{ width: 240 }}
                placement="right"
                visible={visible}
              >

                <FormItem
                  name="password"
                  rules={[
                    ({ validateFields }) => {
                      const { checkPassword } = this;
                      return { validator(rule, value) {
                        return checkPassword(value, validateFields);
                      }}
                    }
                  ]}
                  validateTrigger={['onChange', 'onBlur']}
                  hasFeedback
                >
                  <Input.Password
                    type="password"
                    placeholder={intl.formatMessage(messages.placeholderPassword)}
                    onChange={() => this.setState({visible: true})}
                    onBlur={() => this.setState({visible: false})}
                    onFocus={() => this.setState({visible: true})}
                  />
                </FormItem>
              </Popover>

            <FormItem
              name="confirm"
              rules={[
                { required: true, message: intl.formatMessage(messages.enterPassword) },
                ({ getFieldValue }) => {
                  return { validator(rule, value) {
                    if (value && value !== getFieldValue('password')) {
                      return Promise.reject(intl.formatMessage(messages.passwordsTwice));
                    }
                    return Promise.resolve();
                  }}
                }
              ]}
              validateTrigger={['onChange', 'onBlur']}
              hasFeedback
            >
              <Input.Password
                type="password"
                placeholder={intl.formatMessage(messages.confirmPassword)}
                onBlur={this.handleConfirmBlur}
              />
            </FormItem>
            <InputGroup compact>
              <FormItem
                name="mobile"
                rules={[{ required: true, message: intl.formatMessage(messages.enterPhone) }]}
                style={{ width: '100%' }}
                validateTrigger={['onChange', 'onBlur']}
              >
                <Input addonBefore={(
                  <Form.Item name="prefix" noStyle>
                    <Select>
                      <Option value="86">+86</Option>
                      <Option value="87">+87</Option>
                    </Select>
                  </Form.Item>
                )} placeholder={intl.formatMessage(messages.placeholderPhone)} />
              </FormItem>
            </InputGroup>
            <FormItem
              name="captcha"
              rules={[{ required: true, message: intl.formatMessage(messages.enterCode) }]}
              validateTrigger={['onChange', 'onBlur']}
            >
              <Row gutter={8}>
                <Col span={16}>
                  <Input placeholder={intl.formatMessage(messages.placeholderCode)} />
                </Col>
                <Col span={8}>
                  <Button className="getCaptcha" disabled={count} onClick={this.onGetCaptcha}>
                    {count ? `${count} s` : intl.formatMessage(messages.getCode)}
                  </Button>
                </Col>
              </Row>
            </FormItem>
            <Form.Item
              name="agreement"
              valuePropName="checked"
              rules={[
                { validator:(_, value) => value ? Promise.resolve() : Promise.reject('Should accept agreement') },
              ]}
              validateTrigger={['onChange', 'onBlur']}
            >
              <Checkbox>
                I have read the agreement
              </Checkbox>
            </Form.Item>
            <Row align="center" className="mb-2">
              <Button
                loading={submitting}
                size="large"
                type="primary"
                htmlType="submit"
                className="register-form-button"
              >
                {intl.formatMessage(messages.signUp)}
              </Button>
            </Row>
            <Row align="center">
              <Link to={routerLinks("Login")}>
                {intl.formatMessage(messages.LoginNow)}
              </Link>
            </Row>
          </Form>
        </Content>
      </Layout>
    );
  }
}

export default Register;
