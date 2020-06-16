import React from 'react';
import { Modal } from 'antd';
import $$ from 'cmn-utils';
import config from '@/config';

class BaseComponent extends React.Component {
  notice = config.notice; // notification

  /**
   * History api route jump
   */
  get history() { 
    return this.props.history;
  }

  /**
   * New
   */
  onAdd = () => {
    this.setState({
      record: null,
      visible: true
    });
  };

  /**
   * Modify
   * @param {object} Form record
   */
  onUpdate = record => {
    this.setState({
      record,
      visible: true
    });
  };

  /**
   * Delete
   * @param {object | array} Form records, an array when deleting in bulk
   */
  onDelete = record => {
    if (!record) return;
    if ($$.isArray(record) && !record.length) return;

    const content = `Do you want to delete this ${
      $$.isArray(record) ? record.length : ''
    } item?`;

    Modal.confirm({
      title: 'Note',
      content,
      onOk: () => {
        this.handleDelete($$.isArray(record) ? record : [record]);
      },
      onCancel() {}
    });
  };

  handleAdd() {
    /* Subclass rewriting */
  }
  handleUpdate() {
    /* Subclass rewriting */
  }
  handleDelete(records) {
    /* Subclass rewriting */
  }
}

export default BaseComponent;
