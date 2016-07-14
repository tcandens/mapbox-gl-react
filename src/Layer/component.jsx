import React, { Component, PropTypes } from 'react';

export default class Layer extends Component {
  componentDidUpdate = () => {
    const {
      map,
      name,
    } = this.context;
    const {
      type,
      paint,
    } = this.props;
    if (map && map.getSource(name)) {
      map.addLayer({
        id: name,
        source: name,
        type,
        paint,
      });
    }
  }
  componentWillUnmount = () => {
    const {
      map,
      name,
    } = this.context;
    map.removeLayer(name);
  }
  render = () => null;
}

Layer.contextTypes = {
  map: PropTypes.object,
  name: PropTypes.string,
  source: PropTypes.object,
};
Layer.propTypes = {
  type: PropTypes.string,
  paint: PropTypes.object,
};
