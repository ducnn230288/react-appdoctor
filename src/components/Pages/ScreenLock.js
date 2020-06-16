import React, { PureComponent } from 'react';
import { Layout, Button } from 'antd';
import { router } from 'dva';
import PropTypes from 'prop-types';
import intl from "react-intl-universal";

import PatternLock from 'components/PatternLock';
import Clock from 'components/Clock';
import Mask from 'components/Mask';
import CSSAnimate from 'components/CSSAnimate';
import messages from './messages';

import logoImg from 'assets/images/logo1.png';
import pattern from 'assets/images/pattern.png';

const { Content } = Layout;
const { withRouter } = router;

/**
 * Lock screen interface
 */
@withRouter
class ScreenLock extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showPattern: false,
      patternError: null
    };
  }

  onChange = lock => {
    if (lock) {
      this.props.history.replace('/dashboard');
    } else {
      this.setState({
        patternError: true
      });
    }
  };

  togglePattern = () => {
    this.setState({
      showPattern: !this.state.showPattern
    });
  };

  render() {
    const { title } = this.props;
    const { patternError, showPattern } = this.state;
    return (
      <Layout className="full-layout screen-lock-page">
        <Content>
          <div className="container">
            <div className="pattern-logo">
              <img src={logoImg} alt="logo" />
              <b>LANIF</b>
              <span>Admin</span>
            </div>
            <div className="patter-container">
              <div className="patter-title">{title || intl.formatMessage(messages.welcomeBack)}</div>
              <p>{intl.formatMessage(messages.useUnlock)}</p>
              <CSSAnimate
                className="animated-short"
                type={patternError ? 'shake' : ''}
                callback={_ => this.setState({ patternError: false })}
              >
                <PatternLock lock="14753" onChange={this.onChange} />
              </CSSAnimate>
            </div>
            <div className="patter-tip">
              <Button
                type="primary"
                icon={<i className="las la-question-circle" />}
                onClick={this.togglePattern}
              >
                {intl.formatMessage(messages.patternHint)}
              </Button>
            </div>
          </div>
          <Clock />
        </Content>
        <Mask visible={showPattern} onClose={this.togglePattern}>
          <CSSAnimate
            className="animated-short pattern-tip-modal"
            type={showPattern ? 'flipInY' : 'fadeOutUp'}
          >
            <img src={pattern} alt="14753" />
          </CSSAnimate>
        </Mask>
      </Layout>
    );
  }
}

ScreenLock.propTypes = {
  title: PropTypes.string,
};

ScreenLock.contextTypes = {
  router: PropTypes.object
};

export default ScreenLock;
