import React, { Component, PropTypes } from 'react';
import uniqueId from 'lodash.uniqueid';

export default class Layer extends Component {
  componentDidMount = () => {
    const {
      map,
      source,
      name,
    } = this.context;
    const {
      type,
      paint,
      layout,
      filter,
    } = this.props;
    if (!source) {
      throw new Error('Layer must be used inside a Source component.');
    }
    this.generateId(name, type);
    if (!map.getLayer(this.id)) {
      this.createLayer(type, paint, layout, filter);
    }
  }
  componentWillUnmount = () => {
    const {
      map,
    } = this.context;
    // If map.style is null, parent map is unmounting.
    if (!map || !map.style) return;
    map.removeLayer(this.id);
  }
  id = '';
  generateId = (name, type) => {
    this.id = uniqueId(`MAPBOX-GL-REACT_${name}-${type}-`);
  }
  createLayer = (type, paint, layout, filter) => {
    const {
      map,
      name,
    } = this.context;
    map.addLayer({
      id: this.id,
      source: name,
      type,
      paint,
      layout,
    });
    if (filter) {
      map.setFilter(this.id, filter);
    }
  }
  render = () => null;
}

Layer.contextTypes = {
  map: PropTypes.object,
  name: PropTypes.string,
  source: PropTypes.object,
};
Layer.propTypes = {
  type: PropTypes.oneOf(['symbol', 'circle']).isRequired,
  paint: PropTypes.object,
  layout: PropTypes.object,
  filter: PropTypes.array,
};
Layer.defaultProps = {
  paint: {},
  layout: {},
};
