import React, { Component, PropTypes } from 'react';
import Mapbox from 'mapbox-gl/js';
import isEqual from 'lodash/isEqual';
import isArray from 'lodash/isArray';
const diff = (left, right) => !isEqual(left, right);

export default class GeoJSONSource extends Component {
  state = {
    source: undefined,
  };
  getChildContext = () => ({
    map: this.context.map,
    name: this.props.name,
    source: this.state.source,
  })
  componentDidMount = () => {
    const { map } = this.context;
    if (!map) {
      throw new Error('Source must be used inside of a Mapbox Map component.');
    } else {
      this.createSource();
    }
  }
  componentWillReceiveProps = (nextProps, nextState) => {
    if (diff(nextProps.data, this.props.data)) {
      this.updateSource(nextProps.data);
    } else if (typeof nextProps.data === 'string') {
      this.updateSource(nextProps.data);
    }
  }
  componentWillUnmount = () => {
    const { map } = this.context;
    map.removeSource(this.props.name);
  }
  createSource = () => {
    const { map } = this.context;
    const {
      name,
      data,
    } = this.props;
    const source = new Mapbox.GeoJSONSource({
      data,
    });
    this.setState({ source });
    map.addSource(name, source);
  }
  updateSource = (data) => {
    this.state.source.setData(data);
  }
  render = () => {
    if (this.state.source) {
      if (this.props.children && isArray(this.props.children)) {
        return <div>{this.props.children}</div>;
      }
      return this.props.children || null;
    }
    return null;
  };
}

GeoJSONSource.childContextTypes = {
  name: PropTypes.string,
  source: PropTypes.object,
  map: PropTypes.object,
};
GeoJSONSource.contextTypes = {
  map: PropTypes.object,
};
GeoJSONSource.propTypes = {
  name: PropTypes.string,
  data: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
  ]),
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]),
};
