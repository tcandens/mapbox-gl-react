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
    fetch('https://data.seattle.gov/resource/i5jq-ms7b.json')
      .then(response => {
        if (response.status === 200) {
          return response.json();
        }
      })
      .then(data => {
        const features = data.map(feature => {
          return point([feature.longitude, feature.latitude]);
        });
        const geoJSON = {
          type: 'FeatureCollection',
          features,
        };
        this.setState({
          data: geoJSON,
        });
      });
  }
  render = () => {
    return (
      <div>
        <MapComponent
          accessToken={config.mapboxToken}
          style={config.mapboxStyle}
          center={[-122.3372, 47.6111]}
          pitch={0}
          zoom={12}
          eventHandlers={{
            load: (map) => {
              window.MAPBOX_MAP = map;
            },
          }}
        >
          <Source name="test" data={this.state.data}>
            <Layer />
          </Source>
        </MapComponent>
      </div>
    );
  }
}
