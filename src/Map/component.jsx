import React, { Component, PropTypes } from 'react';
import Mapbox from 'mapbox-gl/js';
import isEqual from 'lodash/isEqual';
const diff = (left, right) => !isEqual(left, right);

import 'mapbox-gl/css';

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
      if (this.queue.length > 0) {
        this.processQueue();
      }
    });

    Object.keys(eventHandlers).forEach(event => {
      map.on(event, (data) => {
        eventHandlers[event](map, data);
      });
    });
  }

  componentWillReceiveProps = (nextProps) => {
    if (diff(nextProps.center, this.props.center)) {
      this.updateView({ center: nextProps.center });
    } else if (diff(nextProps.sources, this.props.sources)) {
      Object.keys(nextProps.sources).forEach(name => {
        this.addSource(name, nextProps.sources[name]);
      });
    } else if (diff(nextProps.layers, this.props.layers)) {
      nextProps.layers.forEach(layer => {
        this.addLayer(layer);
      });
    }
  }
  shouldComponentUpdate = (nextProps, nextState) => (
      nextProps.center !== this.props.center ||
      nextProps.sources !== this.props.sources ||
      nextProps.layers !== this.props.layers ||
      nextState.loaded !== this.state.loaded
  )
  componentWillUnmount = () => {
    this.map.remove();
  }
  queue = [];
  addSource = (name, source) => {
    if (source.features && source.features.length <= 0) {
      console.warn('Source must contain GeoJSON data.');
    }
    const { map } = this;
    const { loaded, sources } = this.state;
    if (sources[name]) {
      sources[name].setData(source.data);
    } else if (loaded) {
      const newSource = new Mapbox.GeoJSONSource({
        ...source,
      });
      this.setState({
        ...this.state,
        sources: {
          ...this.state.sources,
          [name]: newSource,
        },
      });
      map.addSource(name, newSource);
    } else {
      this.queue.push(() => this.addSource(name, source));
    }
  }
  addLayer = (layer) => {
    const { map } = this;
    const { loaded } = this.state;
    if (loaded) {
      map.addLayer(layer);
    } else {
      this.queue.push(() => this.addLayer(layer));
    }
  }
  processQueue = () => {
    queue.forEach(task => {
      if (typeof task === 'function') {
        try {
          task();
        } catch (e) {
          console.error(e, task.toString());
        }
      }
    });
  }
  updateView = ({ center, ...view }) => {
    this.map.flyTo({
      center,
      ...view,
    });
  }
  render = () => {
    return (
      <div
        style={this.props.containerStyle}
        ref={c => { this.mapContainer = c; }}
        className="mapbox-gl-container"
      >
        {this.state.loaded && this.props.children}
      </div>
    );
  };
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
  children: PropTypes.node,
  containerStyle: PropTypes.object,
  zoom: PropTypes.number.isRequired,
  bearing: PropTypes.number,
  pitch: PropTypes.number,
  options: PropTypes.shape({
    minZoom: PropTypes.number,
    maxZoom: PropTypes.number,
    maxBounds: PropTypes.arrayOf(PropTypes.array),
    hash: PropTypes.boolean,
    interactive: PropTypes.boolean,
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
