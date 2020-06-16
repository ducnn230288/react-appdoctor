import React from 'react';
import { connect, router } from 'dva';
import { Layout } from 'antd';
import PropTypes from 'prop-types';

import './styles/user.less';

const { Switch } = router;
const { Content } = Layout;

@connect()
class UserLayout extends React.PureComponent {
  render() {
    const {routerData} = this.props;
    const {childRoutes} = routerData;

    return (
      <Layout className="full-layout user-layout fixed">
        <Content>
          <Switch>{childRoutes}</Switch> 
        </Content>
      </Layout>
    );
  }
}

UserLayout.propTypes = {
  routerData: PropTypes.object,
};

export default UserLayout;
