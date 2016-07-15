import React, { Component } from 'react';
import MapComponent, { Source, Layer } from '../src/';
import config from '../config.json';
import point from 'turf-point';

import './App.sass';

export default class App extends Component {
  state = {
    data: {},
  }
  componentDidMount = () => {
    const setData = () => {
      this.setState({
        data: 'https://wanderdrone.appspot.com/',
      });
    };
    setData();
    setInterval(setData, 2000);
  }
  render = () => {
    return (
      <div>
        <MapComponent
          accessToken={config.mapboxToken}
          style={config.mapboxStyle}
          center={[-122.3372, 47.6111]}
          pitch={0}
          zoom={2}
          eventHandlers={{
            load: (map) => {
              window.MAPBOX_MAP = map;
            },
          }}
        >
          <Source name="test" data={this.state.data}>
            <Layer type="circle" paint={{ 'circle-color': 'red' }} />
          </Source>
        </MapComponent>
      </div>
    );
  }
}
