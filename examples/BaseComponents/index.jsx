import React, { Component } from 'react';
import MapComponent, { Source, Layer } from '../../src/';
import config from '../../config.json';
import point from 'turf-point';

export default class BaseComponentExample extends Component {
  state = {
    data: {},
    permits: {},
  }
  componentDidMount = () => {
    const setData = () => {
      this.setState({
        ...this.state,
        data: 'https://wanderdrone.appspot.com/',
      });
    };
    setData();
    setInterval(setData, 2000);
    fetch('https://data.seattle.gov/resource/mags-97de.json')
      .then(response => {
        return response.json();
      })
      .then(data => {
        const geoJSON = {
          type: 'FeatureCollection',
          features: data.map(permit => (
            point(
              [permit.longitude, permit.latitude],
              { value: permit.value }
            )
          )),
        };
        this.setState({
          ...this.state,
          permits: geoJSON,
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
          zoom={2}
          eventHandlers={{
            load: (map) => {
              window.MAPBOX_MAP = map;
            },
          }}
        >
          <Source name="test" data={this.state.data}>
            <Layer type="circle" paint={{ 'circle-color': 'red' }} />
            <Layer type="circle" paint={{ 'circle-color': 'blue' }} />
            <Layer type="circle" paint={{ 'circle-color': 'blue' }} />
          </Source>
          {/* <Source name="permits" data={this.state.permits}>
            <Layer type="circle"
            paint={{ 'circle-color': 'green' }}
            filter={['>=', 'value', 3000]}
            />
          </Source>*/}
        </MapComponent>
      </div>
    );
  }
}
