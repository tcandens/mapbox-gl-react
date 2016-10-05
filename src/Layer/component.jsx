import React, { Component, PropTypes } from 'react';
import uniqueId from 'lodash.uniqueid';

export default class Layer extends Component {
  componentDidMount = () => {
    const {
      map,
      sourceName,
    } = this.context;
    const {
      type,
      paint,
      layout,
      filter,
    } = this.props;
    if (!sourceName) {
      throw new Error('Layer must be used inside a Source component.');
    }
    this.generateId(sourceName, type);
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
      sourceName,
    } = this.context;
    map.addLayer({
      id: this.id,
      source: sourceName,
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
  sourceName: PropTypes.string,
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
