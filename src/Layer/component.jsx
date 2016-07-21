import React, { Component, PropTypes } from 'react';
import uniqueId from 'lodash/uniqueId';

export default class Layer extends Component {
  componentDidMount = () => {
    const {
      map,
      source,
      name,
    } = this.context;
    const {
      type,
      ...style,
    } = this.props;
    if (!source) {
      throw new Error('Layer must be used inside a Source component.');
    }
    this.generateId(name, type);
    if (!map.getLayer(this.id)) {
      console.log(style);
      this.createLayer(type, style);
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
    this.id = uniqueId(`$MAPBOX-GL-REACT_{name}-${type}-`);
  }
  createLayer = (type, style) => {
    const {
      map,
      name,
    } = this.context;
    map.addLayer({
      id: this.id,
      source: name,
      type,
      ...style,
    });
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
  filter: PropTypes.object,
};
