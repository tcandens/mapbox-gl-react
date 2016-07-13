import React, { Component, PropTypes } from 'react';
import Mapbox from 'mapbox-gl/js';
import isEqual from 'lodash/isEqual';
const diff = (left, right) => !isEqual(left, right);

export default class GeoJSONSource extends Component {
  state = {
    source: null,
  };
  getChildContext = () => ({
    map: this.context.map,
    name: this.props.name,
    source: this.state.source,
  })
  shouldComponentUpdate = (nextProps, nextState) => (
    true
  )
  componentWillReceiveProps = (nextProps) => {
    if (diff(nextProps.data, this.props.data)) {
      if (this.state.source) {
        this.state.source.setData(nextProps.data);
      }
    }
  }
  componentDidUpdate = () => {
    const { map } = this.context;
    const {
      name,
      data,
    } = this.props;
    if (!map) {
      console.warn('Source must be used inside of a Mapbox Map component.');
    } else {
      if (this.state.source) {
        this.state.source.setData(data);
      } else {
        const source = new Mapbox.GeoJSONSource({
          data,
        });
        this.setState({ source });
        map.addSource(name, source);
      }
    }
  }
  componentWillUnmount = () => {
    const { map } = this.context;
    map.removeSource(this.props.name);
  }
  render = () => this.props.children || null;
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
  data: PropTypes.object,
  children: PropTypes.element,
};
