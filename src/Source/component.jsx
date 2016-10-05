import React, { Component, PropTypes } from 'react';
import isArray from 'lodash.isarray';
import { verifyData } from './helpers';

export default class GeoJSONSource extends Component {
  state = {
    added: false,
  }
  getChildContext = () => ({
    map: this.context.map,
    sourceName: this.props.name,
  })
  componentDidMount = () => {
    const { map } = this.context;
    if (!map) {
      throw new Error('Source must be used inside of a Mapbox Map component.');
    } else {
      this.createSource();
    }
  }
  componentWillReceiveProps = (nextProps) => {
    if (verifyData(nextProps.data, this.props.data)) {
      this.updateSource(nextProps.data);
    }
  }
  componentWillUnmount = () => {
    const { map } = this.context;
    // If map.style is null, parent map is unmounting.
    if (map && map.style) {
      map.removeSource(this.props.name);
    }
  }
  createSource = () => {
    const { map } = this.context;
    const {
      name,
      data,
      options,
    } = this.props;
    if (verifyData(data)) {
      const source = {
        type: 'geojson',
        data,
        ...options,
      };
      map.addSource(name, source);
      this.setState({
        added: true,
      });
    }
  }
  updateSource = (data) => {
    const {
      map,
    } = this.context;
    map.getSource(this.props.name).setData(data);
  }
  render = () => {
    if (this.state.added) {
      if (this.props.children && isArray(this.props.children)) {
        return <div data-mapbox-layer-group>{this.props.children}</div>;
      }
      return this.props.children || null;
    }
    return null;
  };
}

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
  options: PropTypes.shape({
    maxzoom: PropTypes.number,
    cluster: PropTypes.boolean,
    clusterRadius: PropTypes.number,
    clusterMaxZoom: PropTypes.number,
  }),
};
GeoJSONSource.contextTypes = {
  map: PropTypes.object,
};
GeoJSONSource.childContextTypes = {
  sourceName: PropTypes.string,
  map: PropTypes.object,
};
