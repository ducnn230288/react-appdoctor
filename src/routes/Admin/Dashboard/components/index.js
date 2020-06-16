import React from 'react';
import { connect } from 'dva';
import { Layout, Row, Col, Typography, Progress, Card, List, Tag, Modal} from 'antd';
import { ReactSVG } from 'react-svg'

import BaseComponent from 'components/BaseComponent';
import Button from 'components/Button';
import './index.less';

import arrowImg from 'assets/images/arrow.svg';
import image1Img from 'assets/images/image-1.jpg';
import image2Img from 'assets/images/image-2.jpg';

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

@connect()
class Dashboard extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      data: [
        { id: 3464, name: "안드로이드 소스 분석", hours: 32 },
        { id: 3465, name: "안드로이드 – 운영서버와 테스트 서버 연결 빌드 생성", hours: 15 },
        { id: 3466, name: "안드로이드 소스 분석", hours: 32 },
        { id: 3477, name: "안드로이드 – 운영서버와 테스트 서버 연결 빌드 생성", hours: 15 },
        { id: 3468, name: "안드로이드 소스 분석", hours: 32 },
      ],
      data2: [
        { id: 2336, name: "1. 서버 – 댓글 기능 업데이트", hours: 32, date: "2019.04.09", status: false, },
        { id: 2337, name: "2. 서버 – 상세페이지 화면 지도의 카카오톡 공유하기 기능 업데이트", hours: 32, date: "2019.04.09", status: true, },
        { id: 2338, name: "3. 서버 – 댓글 기능 업데이트", hours: 32, date: "2019.04.09", status: true, },
        { id: 2339, name: "4. 서버 – 상세페이지 화면 지도의 카카오톡 공유하기 기능 업데이트", hours: 32, date: "2019.04.09", status: true, },
        { id: 2340, name: "4. 서버 – 상세페이지 화면 지도의 카카오톡 공유하기 기능 업데이트", hours: 32, date: "2019.04.09", status: true, },
      ],
      data3: [
        { id: 1, name: "저희가 사용중인 앱을 수정하고자 하는데 견적을 알고 싶습", date: "2019.04.09", status: false, },
        { id: 2, name: "앱닥터 수정사항 요청하고 싶습니다. 미팅도 가능한가요?", date: "2019.04.09", status: true, },
        { id: 3, name: "앱닥터 서비스 어떻게 이용하는 건가요?", date: "2019.04.09", status: true, },
      ]
    };
  }

  render() {
    const { data, data2, data3, visible } = this.state;
    return (
      <Layout className="full-layout page dashboard-page">
        <Modal
          wrapClassName="dashboard"
          title="쿠폰 구매"
          visible={visible}
          onOk={() => this.setState({visible: false})}
          onCancel={() => this.setState({visible: false})}
          footer={(
            <Row gutter={15}>
              <Col span={12}>
                <Button block key="submit" type="primary" onClick={() => this.setState({visible: false})}>
                  시간제 쿠폰 구매하기
                </Button>
              </Col>
              <Col span={12}>
                <Button block key="back" onClick={() => this.setState({visible: false})}>
                  12시간만 구매하기
                </Button>
              </Col>
            </Row>
          )}
        >
          <div className="text-center">승인하기 위해 시간이 부족해 시간 구매가 필요합니다.
            원하시는 구매형태를 선택해주세요
          </div>
        </Modal>
        <Content>
          <Row align="middle" className="header-toolbar">
            <Col className="bg-gray" flex="auto">서비스 진행 현황</Col>
            <Col flex="auto" className="bg-white">
              <Row justify="space-between">
                <Col xs={24} sm={8} className="bg-white primary">
                  <small>진행 중</small> <br/>
                  <span>28 <small>시간</small></span>
                  <Progress percent={10} showInfo={false} status="active" />
                </Col>
                <Col xs={24} sm={8} className="bg-white yellow">
                  <small>전체 완료</small> <br/>
                  <span>456 <small>시간</small></span>
                  <Progress percent={80} showInfo={false} status="active" />
                </Col>
                <Col xs={24} sm={8} className="bg-white success">
                  <small>잔여 시간</small> <br/>
                  <span>12 <small>시간</small></span>
                  <Progress percent={5} showInfo={false} status="active" />
                </Col>
              </Row>
            </Col>
          </Row>
          <div className="toolbar-bottom">
            쿠폰 유효기간( ~ 2020년 3월 10일)이 얼마 남지 않았습니다.
          </div>

          <Row className="group-button" gutter={15}>
            <Col xs={24} sm={8}>
              <Button type="primary" size="large" block>
                시간제 쿠폰 서비스
              </Button>
            </Col>
            <Col xs={24} sm={8}>
              <Button size="large" block>월 후불제</Button>
            </Col>
            <Col xs={24} sm={8}>
              <Button size="large" block>프로젝트</Button>
            </Col>
          </Row>
          <div className="list-status">
            <p>앱닥터 문의 시 아래와 같은 프로세스로 진행됩니다.</p>
            <ul className="list-line">
              <li className="active">문의/요청</li>
              <li className="active">요청 분석</li>
              <li className="active">승인대기중</li>
              <li>개발자 배정</li>
              <li>진행중</li>
              <li>개발완료</li>
              <li>고객 검수</li>
              <li className="success">개발종료</li>
            </ul>
          </div>
          <Row className="list-issue" gutter={15}>
            <Col xs={24} md={12}>
              <Card title="승인 대기 중인 이슈 5건" extra={<Button onClick={() => this.setState({visible: true})} size="small">승인하러 가기</Button>}>
                <List
                  dataSource={data}
                  renderItem={item => (
                    <List.Item key={item.id}>
                      <List.Item.Meta
                        title={(
                          <>
                            <Tag color="#13b5b1">Issue, {item.id}</Tag>
                            <div>{item.name}</div>
                          </>
                        )}
                      />
                      <div className="hours">{item.hours}H</div>
                    </List.Item>
                  )} />
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title="진행 중인 이슈 14건">
                <List
                  dataSource={data2}
                  renderItem={item => (
                    <List.Item key={item.id}>
                      <List.Item.Meta
                        title={(
                          <>
                            <Tag color="#556fb5">Issue, {item.id}</Tag>
                            <div>{item.name}</div>
                          </>
                        )}
                      />
                      <div>
                        <div className="date">{item.date}</div>
                        <div className="hours">
                          {item.hours}H
                          <small className={item.status ? "success" : ""}>개발자 배정</small>
                        </div>
                      </div>
                    </List.Item>
                  )} />
              </Card>
            </Col>
          </Row>

          <Card title="최근 문의 / 요청 현황" extra={<Button type="link" size="small">더보기 <ReactSVG wrapper="span" src={arrowImg} /></Button>}>
            <table>
              <tbody>
              {data3.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.date}</td>
                  <td width="100" className={item.status ? "" : "waiting"}>
                    {item.status ? "답변 완료" : "담당자 확인중"}
                  </td>
                </tr>
              ))}

              </tbody>
            </table>
          </Card>
          <Card title="앱닥터 소식">
            <Row gutter={20}>
              <Col xs={24} md={12}>
                <Row align="middle" gutter={20}>
                  <Col xs={24} md={10}>
                    <img src={image1Img} alt="Test"/>
                  </Col>
                  <Col xs={24} md={14}>
                    <p>
                      <strong>앱닥터 허석균 대표, 김빛나 본부장 <br/>[아산나눔재단/MARU180] 인터뷰 소식!!</strong>
                    </p>
                    <p>
                      안녕하세요. 앱닥터 입니다. <br/>
                      오늘 알려드릴 소식은 아산나눔재단/MARU180에서 진행한 인터뷰 소식입니다.
                      이번 인터뷰의 주인공은 바로 앱닥터의 허석균 대표와 김빛나 본부장입니다.
                      MARU180의 새 식구가 된 것을 격하게 환영해 주셔서 진심으로 감사한 자리였는데…
                    </p>
                    <Button className="fr" type="link" size="small">더보기 <ReactSVG wrapper="span" src={arrowImg} /></Button>
                  </Col>
                </Row>
              </Col>
              <Col xs={24} md={12}>
                <Row align="middle" gutter={20} className="mb-2">
                  <Col xs={24} md={5}>
                    <img src={image2Img} alt="Test"/>
                  </Col>
                  <Col xs={24} md={19}>
                    <p>
                      <strong>앱닥터, 앱/웹 유지 보수 재계약 안하신 대표님들 주목~!</strong>
                    </p>
                    <div>
                      “텍스트 하나만 수정하고 싶은데”, “이미지 하나 더 추가하고 싶은데”
                      “텍스트 하나만 수정하고 싶은데”, “이미지 하나 더 추가하고 싶은데”…
                    </div>
                  </Col>
                </Row>
                <Row align="middle" gutter={20}>
                  <Col xs={24} md={5}>
                    <img src={image2Img} alt="Test"/>
                  </Col>
                  <Col xs={24} md={19}>
                    <p>
                      <strong>앱닥터, 앱/웹 유지 보수 재계약 안하신 대표님들 주목~!</strong>
                    </p>
                    <div>
                      “텍스트 하나만 수정하고 싶은데”, “이미지 하나 더 추가하고 싶은데”
                      “텍스트 하나만 수정하고 싶은데”, “이미지 하나 더 추가하고 싶은데”…
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>
        </Content>
      </Layout>
    );
  }
}

export default Dashboard
