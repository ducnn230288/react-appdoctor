import React from 'react';
import { connect } from 'dva';
import { Layout, Tabs, InputNumber, Row, Col, Card, Divider } from 'antd';

import BaseComponent from 'components/BaseComponent';
import Button from 'components/Button';

import './index.less';

import bannerImg from 'assets/images/banner.jpg';
import banner2Img from 'assets/images/banner-2.jpg';

const { Content } = Layout;
const { TabPane } = Tabs;

@connect()
class Purchase extends BaseComponent {
  render() {
    return (
      <Layout className="full-layout page purchase-page">
        <Content>
          <Card title="서비스 구매">
            <Tabs defaultActiveKey="2">
              <TabPane tab="추천" key="1">
                <div className="text-center">
                  <img src={bannerImg} alt=""/>
                </div>
                <Divider />
                <table>
                  <tbody>
                  <tr>
                    <td>
                      <span className="ticket">
                        <small>개발자 시간제 쿠폰</small> <br/>
                        <strong>20시간</strong>쿠폰
                      </span>
                    </td>
                    <td>
                      <small>700,000원</small>
                    </td>
                    <td>
                      <span className="red">650,000원</span>
                    </td>
                    <td >
                      <Button>
                        구매하기
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span className="ticket">
                        <small>개발자 시간제 쿠폰</small> <br/>
                        <strong>40시간</strong>쿠폰
                      </span>
                    </td>
                    <td>
                      <small>1,200,000원</small>
                    </td>
                    <td>
                      <span className="red">1,100,000원</span>
                    </td>
                    <td >
                      <Button>
                        구매하기
                      </Button>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </TabPane>
              <TabPane tab="시간제 쿠폰" key="2">
                <Row align="middle" gutter={20}>
                  <Col xs={24} sm={16}>
                    <p><strong>앱닥터 시간제 쿠폰 서비스</strong></p>
                    <div>앱닥터만의 새로운 개발 서비스로 시간을 쿠폰처럼 구매하고, 개발에 필요한 시간만큼 소진하는 합리적 서비스를 경험해보세요.</div>
                  </Col>
                  <Col xs={24} sm={8} className="text-center">
                    <img src={banner2Img} alt=""/>
                  </Col>
                </Row>
                <Divider />
                <table>
                  <tbody>
                  <tr>
                    <td>
                      <span className="ticket">
                        <small>개발자 시간제 쿠폰</small> <br/>
                        <strong>20시간</strong>쿠폰
                      </span>
                    </td>
                    <td>
                      <span className="red">700,000원</span>
                    </td>
                    <td>
                      <InputNumber min={1} max={1} defaultValue={1} />
                    </td>
                    <td>
                      <Button>
                        구매하기
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span className="ticket">
                        <small>개발자 시간제 쿠폰</small> <br/>
                        <strong>40시간</strong>쿠폰
                      </span>
                    </td>
                    <td>
                      <span className="red">1,200,000원</span>
                    </td>
                    <td>
                      <InputNumber min={1} max={5} defaultValue={1} />
                    </td>
                    <td>
                      <Button>
                        구매하기
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span className="ticket">
                        <small>개발자 시간제 쿠폰</small> <br/>
                        <strong>160시간</strong>쿠폰
                      </span>
                    </td>
                    <td>
                      <span className="red">4,200,000원</span>
                    </td>
                    <td>
                      <InputNumber min={1} max={10} defaultValue={1} />
                    </td>
                    <td>
                      <Button>
                        구매하기
                      </Button>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </TabPane>
            </Tabs>
          </Card>
        </Content>
      </Layout>
    );
  }
}

export default Purchase
