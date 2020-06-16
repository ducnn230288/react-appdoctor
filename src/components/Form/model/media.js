import React, {Component} from 'react';
import { Row, Col } from 'antd';
import MediaManagement from 'components/MediaManagement';
import PropTypes from "prop-types";

class MediaControlled extends Component {
  constructor(props) {
    super(props);
    let values = []
    if (props.value) {
      values = props.limit === 1 ? [props.value] : JSON.parse(props.value);
    }
    this.state = {
      visible: false,
      url: values,
      index: -1,
    };
  }
  onSelect = (newUrl, type) => {
    const { onChange, limit } = this.props;
    const { url, index } = this.state;
    if (index > -1) {
      url[index] = newUrl;
    } else {
      url.push(newUrl)
    }
    if (limit === 1) {
      onChange(newUrl);
    } else {
      onChange(JSON.stringify(url))
    }
    this.setState({ visible: false, url })
  };

  render() {
    const { limit } = this.props;
    const { visible, url } = this.state;
    const propsMedia = {
      visible,
      onHide: () => this.setState({ visible: false }),
      onSelect: this.onSelect,
    }
    return (
      <>
        <Row gutter={[10, 10]}>
        {url.map((item, index) => (
          <Col key={index} onClick={() => this.setState({ visible: true, index })}>
            <div className="media">
              <img src={item} alt="avatar" style={{ width: '100%' }} />
            </div>
          </Col>
        ))}
        { url.length < limit && (
          <Col onClick={() => this.setState({ visible: true, index: -1 })}>
            <div className="media">
              <i className="las la-plus la-3x" />
            </div>
          </Col>
        )}
        </Row>
        <MediaManagement { ...propsMedia }/>
      </>
    )
  }
}
MediaControlled.propTypes = {
  value: PropTypes.string,
  limit: PropTypes.number,
  onChange: PropTypes.func,
};

MediaControlled.defaultProps = {
  limit: 1,
};

export default ({
  ...otherProps
}) => <MediaControlled {...otherProps} />;
