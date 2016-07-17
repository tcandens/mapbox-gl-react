import React, { Component, PropTypes } from 'react';
import Mapbox from 'mapbox-gl/dist/mapbox-gl';
import isEqual from 'lodash/isEqual';
const diff = (left, right) => !isEqual(left, right);

import 'mapbox-gl/dist/mapbox-gl.css';

export default class Map extends Component {
  state = {
    loaded: false,
    map: undefined,
  }
  getChildContext = () => ({
    map: this.state.map,
  })
  componentDidMount = () => {
    const {
      accessToken,
      style,
      eventHandlers,
      center,
      zoom,
      bearing,
      pitch,
      options,
    } = this.props;

    Mapbox.accessToken = accessToken;

    const map = this.map = new Mapbox.Map({
      container: this.mapContainer,
      style,
      center,
      zoom,
      bearing,
      pitch,
      options,
    });

    map.on('load', () => {
      this.setState({
        ...this.state,
        loaded: true,
        map,
      });
    });

    Object.keys(eventHandlers).forEach(event => {
      // Event handlers can be created with camelcase
      // but Mapbox refers to them in lowercase
      const eventName = event.toLowerCase();
      map.on(eventName, (data) => {
        eventHandlers[event](map, data);
      });
    });
  }

  componentWillReceiveProps = (nextProps) => {
    if (diff(nextProps.center, this.props.center)) {
      this.updateView({ center: nextProps.center });
    }
  }
  componentWillUnmount = () => {
    this.map.remove();
  }
  updateView = ({ center, ...view }) => {
    this.map.flyTo({
      center,
      ...view,
    });
  }
  render = () => (
    <div
      style={this.props.containerStyle}
      ref={c => { this.mapContainer = c; }}
      className="mapbox-gl-container"
    >
      {this.state.loaded && this.props.children}
    </div>
  )
}
Map.childContextTypes = {
  map: PropTypes.object,
};
Map.defaultProps = {
  eventHandlers: {},
  bearing: 0,
  pitch: 0,
  containerStyle: {},
};
Map.propTypes = {
  accessToken: PropTypes.string.isRequired,
  style: PropTypes.string.isRequired,
  center: PropTypes.arrayOf(PropTypes.number).isRequired,
  zoom: PropTypes.number.isRequired,
  children: PropTypes.node,
  containerStyle: PropTypes.object,
  bearing: PropTypes.number,
  pitch: PropTypes.number,
  options: PropTypes.shape({
    minZoom: PropTypes.number,
    maxZoom: PropTypes.number,
    maxBounds: PropTypes.arrayOf(PropTypes.array),
    hash: PropTypes.boolean,
    interactive: PropTypes.boolean,
    moveToMethod: PropTypes.oneOf(['flyTo', 'jumpTo', 'easeTo']),
  }),
  eventHandlers: PropTypes.shape({
    movestart: PropTypes.func,
    mousedown: PropTypes.func,
    moveend: PropTypes.func,
    move: PropTypes.func,
    mouseup: PropTypes.func,
    load: PropTypes.func,
    mouseout: PropTypes.func,
    click: PropTypes.func,
    dblclick: PropTypes.func,
  }),
};
