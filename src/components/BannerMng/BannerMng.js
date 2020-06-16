import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, message } from 'antd';
import isEqual from 'react-fast-compare';
import intl from 'react-intl-universal';

import LazyLoad from 'components/LazyLoad';
import notdata from 'assets/images/nodata.svg';
import Form from './Form';
import messages from './messages';

import './style/index.less';

// Preset columns
const columns = [
  {
    title: 'title',
    name: 'title',
    formItem: {
      rules: [
        {
          required: true,
          message: intl.formatMessage(messages.enterTitle),
        },
        {
          max: 300,
          message: intl.formatMessage(messages.enterUp300),
        },
        {
          pattern: /^[\w\u4E00-\u9FA5]+$/,
          message: intl.formatMessage(messages.onlyInput),
        }
      ]
    }
  },
  {
    title: 'link',
    name: 'link',
    formItem: {
      rules: [
        {
          required: true,
          message: intl.formatMessage(messages.enterLink),
        },
        {
          max: 300,
          message: intl.formatMessage(messages.enterLink300),
        }
      ]
    }
  },
  {
    title: 'file',
    name: 'file',
    formItem: {
      type: 'upload',
      listType: 'picture-card',
      max: 1,
      fileTypes: ['.png', '.jpg', '.gif'],
      normalize: value => {
        return [
          {
            uid: -1,
            thumbUrl: value
          }
        ];
      },
      rules: [
        {
          required: true,
          message: intl.formatMessage(messages.uploadImg),
        }
      ],
      renderUpload: (a, b, isDisabled) =>
        isDisabled ? null : (
          <div>
            <i className="las la-plus" />
            <div className="ant-upload-text">{intl.formatMessage(messages.upload)}</div>
          </div>
        )
    }
  }
];

class BannerMng extends Component {
  constructor(props) {
    const { formCols } = props;
    super(props);

    let imageKey = null;
    formCols.forEach(item => {
      if (item.formItem && item.formItem.type === 'upload') {
        imageKey = item.name;
      }
    });
    if (!imageKey)
      console.error("BannerMng required a column of type 'upload'");

    this.state = {
      isEdit: false,
      isAdd: false,
      record: null,
      imageKey,
      dataSource: props.dataSource || []
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.dataSource && !isEqual(prevState.dataSource, nextProps.dataSource)) {
      return {
        dataSource: nextProps.dataSource
      }
    }
    return null;
  }

  onEditBanner = (item, editKey) => {
    this.setState({
      isEdit: editKey,
      isAdd: false,
      record: item
    });
  };

  onAddBanner = () => {
    if (this.props.fileNum && this.props.fileNum > 0) {
      if (this.props.dataSource.length >= this.props.fileNum) {
        message.error(`${intl.formatMessage(messages.canAddUpTo)} ${this.props.fileNum} ${intl.formatMessage(messages.picture)}`);
        return;
      }
    }

    this.setState({
      isAdd: true,
      isEdit: false,
      record: null
    });
  };

  onCancel = () => {
    this.setState({
      isAdd: false,
      isEdit: false,
      record: null
    });
  };

  onChange = (type, item, i) => {
    let { dataSource, isEdit } = this.state;
    const newState = {};
    switch (type) {
      case 'up':
        dataSource.splice(i - 1, 0, dataSource.splice(i, 1)[0]);
        break;
      case 'down':
        dataSource.splice(i + 1, 0, dataSource.splice(i, 1)[0]);
        break;
      case 'add':
        newState.isAdd = false;
        dataSource.push(item);
        break;
      case 'edit':
        let tempIndex = -1;
        let temp = dataSource.filter((data, index) => {
          if ('edit_' + index === isEdit) {
            tempIndex = index;
            return false;
          }
          return true;
        });
        temp.splice(tempIndex, 0, item);
        dataSource = temp;
        newState.isEdit = false;
        break;
      case 'delete':
        dataSource.splice(i, 1);
        break;
      default:
        break;
    }
    this.setState({
      dataSource,
      ...newState
    });

    this.props.onChange && this.props.onChange(dataSource);
  };

  render() {
    const { formCols, title } = this.props;
    let { dataSource, record, isEdit, isAdd, imageKey } = this.state;

    return (
      <div className="banner-view-mng">
        <div className="banner-title">
          <div className="title">
            <i className="las la-image" /> {isEdit ? intl.formatMessage(messages.edit) : isAdd ? intl.formatMessage(messages.new) : ''}
            {title}
          </div>
          <div className="btns">
            {!isAdd && !isEdit ? (
              <Button icon={<i className="las la-plus" />} type="primary" onClick={this.onAddBanner}>
                {intl.formatMessage(messages.new)}
              </Button>
            ) : (
              <Button icon={<i className="las la-undo" />} onClick={this.onCancel}>
                {intl.formatMessage(messages.back)}
              </Button>
            )}
          </div>
        </div>
        {isEdit || isAdd ? (
          <Form
            imageKey={imageKey}
            columns={formCols}
            record={record}
            onCancel={this.onCancel}
            onSubmit={values => this.onChange(isEdit ? 'edit' : 'add', values)}
          />
        ) : (
          <div className="banner-content clearfix">
            {!dataSource.length ? (
              <div className="notdata">
                <img src={notdata} alt="" />
                <div>{intl.formatMessage(messages.noContent)}</div>
              </div>
            ) : null}
            {dataSource.map((item, i) => (
              <div className="row" key={i}>
                <div className="preview">
                  <LazyLoad dataSrc={item[imageKey]} />
                </div>
                <ul className="oper">
                  <li className="top">
                    <Button
                      icon={<i className="las la-angle-up" />}
                      title={intl.formatMessage(messages.moveUp)}
                      disabled={i === 0}
                      onClick={e => this.onChange('up', item, i)}
                    />
                  </li>
                  <li className="bottom">
                    <Button
                      icon={<i className="las la-angle-down" />}
                      title={intl.formatMessage(messages.moveDown)}
                      disabled={i === dataSource.length - 1}
                      onClick={e => this.onChange('down', item, i)}
                    />
                  </li>
                  <li className="edit">
                    <Button
                      icon={<i className="las la-edit" />}
                      title={intl.formatMessage(messages.edit)}
                      onClick={e => this.onEditBanner(item, 'edit_' + i)}
                    />
                  </li>
                  <li className="remove">
                    <Button
                      icon={<i className="las la-times" />}
                      title={intl.formatMessage(messages.close)}
                      onClick={e => this.onChange('delete', item, i)}
                    />
                  </li>
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}

BannerMng.propTypes = {
  dataSource: PropTypes.array,
  onChange: PropTypes.func,
  fileNum: PropTypes.number,
  formCols: PropTypes.array,
  title: PropTypes.node,
  fileSize: PropTypes.number,
  fileType: PropTypes.array,
};

BannerMng.defaultProps = {
  formCols: columns,
  title: intl.formatMessage(messages.slide),
};

export default BannerMng;
