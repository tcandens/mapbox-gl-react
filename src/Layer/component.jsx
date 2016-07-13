import React, { Component, PropTypes } from 'react';

export default class Layer extends Component {
  componentDidUpdate = () => {
    const {
      map,
      name,
    } = this.context;
    if (map && map.getSource(name)) {
      map.addLayer({
        id: name,
        source: name,
        type: 'circle',
        paint: {
          'circle-color': 'red',
        },
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
