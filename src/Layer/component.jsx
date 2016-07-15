import React, { Component, PropTypes } from 'react';
import uniqueId from 'lodash/uniqueId';

export default class Layer extends Component {
  id = '';
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
      this.createLayer(type, ...style);
    }
  }
  shouldComponentUpdate = () => false;
  componentWillUnmount = () => {
    const {
      map,
    } = this.context;
    map.removeLayer(this.id);
  }
  generateId = (name, type) => {
    this.id = uniqueId(`${name}-${type}-`);
  }
  createLayer = (type, ...style) => {
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
