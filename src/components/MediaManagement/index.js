import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Breadcrumb, Button, Card, Col, Modal, Row, Drawer, Upload, Popover, Popconfirm, Spin, Tabs } from 'antd';
import Form from 'components/Form';
import $$ from "cmn-utils";

import { getList_MEDIA, save_MEDIA, delete_MEDIA } from "./service";

import './style/index.less';

const { TabPane } = Tabs;

class MediaManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleDraw: false,
      loading: true,
      url: "/",
      data: [],
      status: 1,
    }
    this.getList("/");
  }

  getList = async (url) => {
    const data = await getList_MEDIA(url);
    this.setState({ data, url, loading: false })
  }

  url = (index = 1) => {
    const { url } = this.state;
    this.setState({ loading: true })
    const array = url.split("/");
    if (array.length > 2) {
      return this.getList(array.slice(0, index).join("/") + '/');
    }
    return this.getList("/");
  }

  onSubmit = async (value) => {
    const { url } = this.state;
    this.setState({ loading: true })
    value.type = "folder";
    value.path = url;
    await save_MEDIA(value)
    await this.getList(url);
  }

  detail = item => (
    <>
      <div>Name: {item.name}</div>
      {item.type !== "folder" && (
        <>
          <div>Size: {item.size}</div>
          <div>Last Modified: {item.lastModified}</div>
        </>
      )}
    </>
  )

  handleDelete = async file => {
    const { url } = this.state;
    this.setState({ loading: true })
    try {
      await delete_MEDIA({
        path: file.origin,
        type: file.type,
      });
      await this.getList(url);
    } catch {
      this.setState({ loading: false })
    }
  }

  button = (type) => {
    switch (type) {
      case "zip":
        return <i className="las la-file-archive" />
      case "pdf":
        return <i className="las la-file-pdf" />
      case "file":
        return <i className="las la-file-alt" />
      case "video":
        return <i className="las la-film" />
      case "image":
        return <i className="las la-image" />
      default:
        break;
    }
  }

  title = (file) => {
    const { onSelect } = this.props;
    return (
      <Row justify="space-between" align="middle">
        <div>Detail</div>
        <Button.Group>
          <Button size="small" type="link" onClick={() => onSelect(file.url, file.type)}>
            { this.button(file.type) }
          </Button>

          <Popconfirm
            title="Are you sure？"
            icon={<i className="las la-question-circle" />}
            onConfirm={() => this.handleDelete(file)}
          >
            <Button size="small" type="link" danger>
              <i className="las la-trash-alt" />
            </Button>
          </Popconfirm>
        </Button.Group>
      </Row>
    )
  }

  render() {
    const { visible, onHide } = this.props;
    const { visibleDraw, status, data, url, loading } = this.state;

    const props = {
      action: '/api/v1/media',
      headers: { Authorization: $$.getStore("user").token },
      listType: 'picture',
      className: "upload-block",
      data: (file) => {
        return {
          file,
          path: url
        }
      },
      onChange: (data) => {
        if (data.file.percent === 100 && data.event) {
          this.getList(url);
        }
      }
    };
    const formProps = {
      loading,
      columns: [
        {
          title: "Name Folder",
          name: "name",
          formItem: {
            rules: [
              { required: true, message: "Please enter name folder!" },
              { validator:(_, value) => /^[a-zA-Z\d]+$/.test(value) ? Promise.resolve() : Promise.reject('Only letters and digits allowed') }
            ]
          }
        }
      ],
      formItemLayout: {
        labelCol: { span: 24 },
        wrapperCol: { span: 24 }
      },
      onSubmit: this.onSubmit
    };
    const formOutsideProps = {
      loading,
      columns: [
        {
          title: "Link",
          name: "link",
          formItem: {
            rules: [
              { required: true, message: "Please enter name folder." },
              { type: "url", message: "Incorrect path format." },
            ]
          }
        },
        {
          title: "Type",
          name: "type",
          dict: [
            { code: "image", codeName: "Image" },
            { code: "youtube", codeName: "YouTube" },
          ],
          formItem: {
            type: "select",
            rules: [
              { required: true, message: "Please enter name folder." },
            ]
          }
        }
      ],
      formItemLayout: {
        labelCol: { span: 24 },
        wrapperCol: { span: 24 }
      },
      onSubmit: (value) => {
        console.log(value);
      }
    };

    return (
      <>
        <Modal
          title="Media Management"
          width={700}
          visible={visible}
          footer={null}
          onCancel={onHide}
        >
          <Tabs defaultActiveKey="1">
            <TabPane tab="My file" key="1">
              <Row justify="space-between" style={{paddingBottom: "10px"}}>
                <Col>
                  <Breadcrumb>
                    {url.split("/").map((item, index) => {
                      return (
                        <Breadcrumb.Item key={index} onClick={() => this.url(index + 1)}>
                          {index === 0 ? <i className="las la-home" /> : item}
                        </Breadcrumb.Item>
                      )
                    })}
                  </Breadcrumb>
                </Col>
                <Col>
                  <Button.Group>
                    <Button type="primary" size="small" onClick={() => this.setState({ visibleDraw: true, status: 1 })}>
                      <i className="las la-folder-plus" />
                    </Button>
                    <Button type="primary" size="small" onClick={() => this.setState({ visibleDraw: true, status: 2 })}>
                      <i className="las la-file-upload" />
                    </Button>
                  </Button.Group>
                </Col>
              </Row>
              <Spin spinning={loading}>
                <Row gutter={[16, 16]} align="middle">
                  { url.slice(1).split("/").length > 1 && (
                    <Col span={6}>
                      <Card
                        onClick={() => this.url(url.split("/").length - 2)}
                        bodyStyle={{padding: 10, textAlign: "center"}}
                        hoverable
                      >
                        <i className="las la-level-up-alt la-3x" />
                        <div>Up to Folder</div>
                      </Card>
                    </Col>
                  )}
                  {data.map((item, index) => (
                    <Col span={6} key={index}>
                      <Popover content={this.detail(item)} title={this.title(item)}>
                        <Card
                          onClick={() => { item.type === "folder" && this.getList(url + item.name + "/") }}
                          bodyStyle={{padding: item.type !== "folder" ? 0 : 10, textAlign: "center"}}
                          hoverable
                          cover={item.type !== "folder" && <img alt="example" src={item.url} />}
                        >
                          {item.type === "folder" && (
                            <>
                              <i className="las la-folder-open la-3x" />
                              <div>{item.name}</div>
                            </>
                          )}
                        </Card>
                      </Popover>
                    </Col>
                  ))}
                </Row>
              </Spin>
            </TabPane>
            <TabPane tab="Outside" key="2">
              <Form ref="form" {...formOutsideProps} />
            </TabPane>
          </Tabs>
        </Modal>
        <Drawer
          title={status === 1 ? "Create Folder" : "Upload File"}
          placement="right"
          closable={false}
          onClose={() => this.setState({ visibleDraw: false })}
          visible={visibleDraw}
        >
          { status === 1 ? (
            <Form ref="form" {...formProps} />
          ) : (
            <Upload {...props}>
              <Button block>
                <i className="las la-file-upload" /> Upload
              </Button>
            </Upload>
          )}
        </Drawer>
      </>
    );
  }
}
MediaManagement.propTypes = {
  visible: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
}

MediaManagement.defaultProps = {
}
export default MediaManagement;
