import React, { Component } from 'react';
import { Breadcrumb, Row, Col } from 'antd';
import { router } from 'dva';
import PropTypes from 'prop-types';
import cx from 'classnames';
import isEqual from 'react-fast-compare';
import intl from "react-intl-universal";

import CSSAnimate from 'components/CSSAnimate';
import Mask from 'components/Mask';
import messages from './messages';

import './style/index.less';

const { Link } = router;

class TopBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentRoute: TopBar.getRouteLevel(props.location.pathname) || []
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!isEqual(nextProps.currentRoute, prevState.currentRoute)) {
      return {
        currentRoute: TopBar.getRouteLevel(nextProps.location.pathname)
      };
    }

    return null;
  }

  static getRouteLevel = pathName => {
    const orderPaths = [];
    pathName.split('/').reduce((prev, next) => {
      const path = [prev, next].join('/');
      orderPaths.push(path);
      return path;
    });

    return orderPaths
      .map(item => window.dva_router_pathMap[item])
      .filter(item => !!item);
  };

  render() {
    const {
      expand,
      toggleRightSide,
      collapsedRightSide,
      onCollapse,
      menu
    } = this.props;
    let { currentRoute } = this.state;
    const classnames = cx('topbar', {
      'topbar-expand': expand
    });

    if (currentRoute.length > 0) {
      const tempCurrentRoute = [];
      menu.map(item0 => {
        if (item0.path.indexOf(currentRoute[0].path) > -1 || item0.children) {
          if (!item0.children) {
            tempCurrentRoute.push({ title: item0.name, path: item0.path })
          } else {
            item0.children.map(item1 => {
              if (item1.path.indexOf(currentRoute[0].path) > -1) {
                tempCurrentRoute.push({ title: item0.name, path: item0.path })
                tempCurrentRoute.push({ title: item1.name, path: item1.path })
              } else if (item1.children) {
                item1.children.map(item2 => {
                  if (item2.path.indexOf(currentRoute[0].path) > -1) {
                    tempCurrentRoute.push({ title: item0.name, path: item0.path })
                    tempCurrentRoute.push({ title: item1.name, path: item1.path })
                    tempCurrentRoute.push({ title: item2.name, path: item2.path })
                  }
                  return item2
                })
              }
              return item1;
            })
          }
        }
        return item0;
      })
      currentRoute = tempCurrentRoute;
    }

    return (
      <div className={classnames}>
        <div className="topbar-dropmenu">
          <Row gutter={22}>
            <Col xs={8} md={4}>
              <CSSAnimate
                className="animated-short"
                type={expand ? 'fadeInDown' : 'fadeOutUp'}
              >
                <button className="metro-tile">
                  <i className="las la-mail-bulk" />
                  <span className="metro-title">{intl.formatMessage(messages.information)}</span>
                </button>
              </CSSAnimate>
            </Col>
            <Col xs={8} md={4}>
              <CSSAnimate
                className="animated-short"
                type={expand ? 'fadeInDown' : 'fadeOutUp'}
              >
                <button className="metro-tile">
                  <i className="las la-user" />
                  <span className="metro-title">{intl.formatMessage(messages.user)}</span>
                </button>
              </CSSAnimate>
            </Col>
            <Col xs={8} md={4}>
              <CSSAnimate
                className="animated-short"
                type={expand ? 'fadeInDown' : 'fadeOutUp'}
              >
                <button className="metro-tile">
                  <i className="las la-headphones" />
                  <span className="metro-title">{intl.formatMessage(messages.support)}</span>
                </button>
              </CSSAnimate>
            </Col>
            <Col xs={8} md={4}>
              <CSSAnimate
                className="animated-short"
                type={expand ? 'fadeInDown' : 'fadeOutUp'}
              >
                <button className="metro-tile">
                  <i className="las la-sliders-h" />
                  <span className="metro-title">{intl.formatMessage(messages.settings)}</span>
                </button>
              </CSSAnimate>
            </Col>
            <Col xs={8} md={4}>
              <CSSAnimate
                className="animated-short"
                type={expand ? 'fadeInDown' : 'fadeOutUp'}
              >
                <button className="metro-tile">
                  <i className="las la-play" />
                  <span className="metro-title">{intl.formatMessage(messages.Video)}</span>
                </button>
              </CSSAnimate>
            </Col>
            <Col xs={8} md={4}>
              <CSSAnimate
                className="animated-short"
                type={expand ? 'fadeInDown' : 'fadeOutUp'}
              >
                <button className="metro-tile">
                  <i className="las la-image" />
                  <span className="metro-title">{intl.formatMessage(messages.Image)}</span>
                </button>
              </CSSAnimate>
            </Col>
          </Row>
        </div>
        <header className="topbar-content">
          {currentRoute.length ? (
            <Breadcrumb>
              <Breadcrumb.Item className="first">
                <CSSAnimate className="inline-block" type="flipInX">
                  {currentRoute[currentRoute.length - 1].title}
                </CSSAnimate>
              </Breadcrumb.Item>
              <Breadcrumb.Item className="icon">
                <Link to="/"><i className="las la-home" /></Link>
              </Breadcrumb.Item>
              {currentRoute.map((item, index) => (
                <Breadcrumb.Item key={index}>
                  {index === currentRoute.length - 1 ? (
                    <CSSAnimate className="inline-block" type="flipInX">
                      {item.title}
                    </CSSAnimate>
                  ) : (
                    <Link to={item.path}>{item.title}</Link>
                  )}
                </Breadcrumb.Item>
              ))}
            </Breadcrumb>
          ) : null}
          {/*<button*/}
          {/*  className={cx('topbar-right', { collapse: collapsedRightSide })}*/}
          {/*  onClick={toggleRightSide}*/}
          {/*>*/}
          {/*  <i className="las la-sign-in-alt" />*/}
          {/*</button>*/}
        </header>
        <Mask
          visible={expand}
          onClose={onCollapse}
          getContainer={node => node.parentNode}
        />
      </div>
    );
  }
}

TopBar.propTypes = {
  location: PropTypes.object,
  expand: PropTypes.bool,
  collapsedRightSide: PropTypes.bool,
  toggleRightSide: PropTypes.func,
  onCollapse: PropTypes.func,
  rightSideBar: PropTypes.bool,
  menu: PropTypes.array,
};

export default TopBar;
