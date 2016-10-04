import { Component, PropTypes } from 'react';
import MapboxGL from 'mapbox-gl/dist/mapbox-gl';

export default class Reticle extends Component {
  componentDidMount = () => {
    const {
      map,
    } = this.context;
    const {
      className,
    } = this.props;
    if (!map) throw new Error('Reticle must be used inside of a map.');
    const element = document.createElement('div');
    if (className) {
      element.classList.add(className);
    }
    this.marker = new MapboxGL.Marker(element)
      .setLngLat(map.getCenter())
      .addTo(map);
    map.on('move', () => {
      this.marker.setLngLat(map.getCenter());
    });
  }
  shouldComponentUpdate = () => false;
  componentWillUnmount = () => {
    this.marker.remove();
  }
  marker = undefined;
  render = () => null;
}

Reticle.contextTypes = {
  map: PropTypes.object.isRequired,
};
Reticle.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
};
