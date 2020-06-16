import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Button, Col, Drawer, Modal, Popconfirm, Row} from 'antd';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import intl from "react-intl-universal";

import Form from 'components/Form';
import messages from "./messages";

import './style/index.less';

class ModalDragList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleEditMenu: false,
      record: null,
    }
  }

  onEdit = (record) => {
    this.setState({ visibleEditMenu: true, record })
  }

  onSubmit = (value) => {
    const { onSubmit, data } = this.props;
    const { record } = this.state;
    let temp;

    value = {...record, ...value};

    if (!!record) {
      temp = data.map((item) => {
        if (item.id === value.id) {
          return value
        }
        return item
      })
    } else {
      value.id = -data.length
      value.order = data.length + 1
      data.push(value)
      temp = [...data];
    }
    onSubmit(temp);
    this.setState({ visibleEditMenu: false, record: null })
  }

  onDragEnd = (result) => {
    let { data, onDrag } = this.props
    const { source, destination } = result
    if (!destination) { return; }
    const temp = [ ...data ];
    const [removed] = temp.splice(source.index, 1);
    temp.splice(destination.index, 0, removed);
    temp.map((item, index) => {
      item.order = index + 1;
      return item;
    })
    return onDrag(temp)
  }

  getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: "none",
    padding: "8px 8px 8px 16px",
    margin: `0 0 8px 0`,
    borderLeftWidth: 3,
    borderLeftStyle: "solid",
    borderLeftColor: isDragging ? "#1bc5bd" : "#3699ff",
    ...draggableStyle
  });

  render() {
    const { classname, title, onCancel, onSave, onDelete, loading, modalOpts, visible, data, formOpts, columns } = this.props;
    const { visibleEditMenu, record } = this.state;
    const modalProps = {
      className: classname,
      visible,
      title: title,
      // maskClosable: true,
      destroyOnClose: true,
      onCancel: onCancel,
      footer: [
        onCancel && (
          <Button key="back" onClick={onCancel}>
            {intl.formatMessage(messages.cancel)}
          </Button>
        ),
        onSave && (
          <Button key="submit" type="primary" onClick={onSave} loading={loading}>
            {intl.formatMessage(messages.save)}
          </Button>
        )
      ],
      ...modalOpts
    };
    const formProps = {
      columns,
      record,
      onSubmit: this.onSubmit,
      formItemLayout: {
        labelCol: { span: 24 },
        wrapperCol: { span: 24 }
      },
      ...formOpts
    };

    return (
      <>
        <Modal {...modalProps}>
          <Button size="small" onClick={() => this.onEdit(null)}>
            <i className="las la-plus" />
          </Button>
          <DragDropContext onDragEnd={this.onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  { data.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id + ""} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={this.getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                        >
                          <Row align="middle" justify="space-between">
                            <Col>{item.order}. {item.title}</Col>
                            <Col>
                              <Button.Group>
                                <Button size="small" onClick={() => this.onEdit(item)}>
                                  <i className="las la-edit" />
                                </Button>
                                <Popconfirm
                                  title="Are you sure？"
                                  icon={<i className="las la-question-circle" />}
                                  onConfirm={() => onDelete(index)}
                                >
                                  <Button size="small" type="primary" danger>
                                    <i className="las la-trash-alt" />
                                  </Button>
                                </Popconfirm>
                              </Button.Group>
                            </Col>
                          </Row>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Modal>
        <Drawer
          destroyOnClose={true}
          title={record ? intl.formatMessage(messages.edit) :  intl.formatMessage(messages.new)}
          placement="right"
          closable={false}
          onClose={() => this.setState({ visibleEditMenu: false })}
          visible={visibleEditMenu}
        >
          <Form ref="form" {...formProps} />
        </Drawer>
      </>
    );
  }
}

ModalDragList.propTypes = {
  visible: PropTypes.bool,
  loading: PropTypes.bool,
  className: PropTypes.string,
  title: PropTypes.string,
  data: PropTypes.array,
  columns: PropTypes.array,
  onDrag: PropTypes.func,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
  onSubmit: PropTypes.func,
  onDelete: PropTypes.func,
  modalOpts: PropTypes.object,
  formOpts: PropTypes.object,
}

ModalDragList.defaultProps = {
  visible: false,
  data: [],
}

export default ModalDragList;
