import React, { Component } from 'react';
import MapComponent from '../../src';
import config from '../../config.json';

import './style.sass';

const LOCATIONS = {
  'Seattle': [-122.3317, 47.6057],
  'San Francisco': [-122.4188, 37.7734],
  'Denver': [-104.9867, 39.7329],
};
const METHODS = [
  'flyTo',
  'jumpTo',
  'easeTo',
];


export default class MoveToMethod extends Component {
  state = {
    center: LOCATIONS['Seattle'],
    moveToMethod: METHODS[0],
  }
  handleChangeCenter = (center) => {
    this.setState({
      ...this.state,
      center,
    });
  }
  handleChangeMethod = (moveToMethod) => {
    this.setState({
      ...this.state,
      moveToMethod,
    });
  }
  render = () => {
    const {
      center,
      moveToMethod,
    } = this.state;
    return (
      <section className="wrapper">
        <MapComponent
          accessToken={config.mapboxToken}
          style="mapbox://styles/mapbox/light-v9"
          center={center}
          zoom={12}
          options={{
            moveToMethod,
          }}
        />
        <section className="location-menu">
          {Object.keys(LOCATIONS).map((location, index) => (
            <div
              className="location"
              className={LOCATIONS[location] === this.state.center ? 'location-selected' : 'location'}
              onClick={this.handleChangeCenter.bind(this, LOCATIONS[location])}
              key={index}
            >
              {location}
            </div>
          ))}
        </section>
        <section className="method-menu">
          {METHODS.map((method, index) => (
            <a
              className={method === this.state.moveToMethod ? 'method-selected' : 'method'}
              onClick={this.handleChangeMethod.bind(this, method)}
              key={index}
            >
              {method}
            </a>
          ))}
        </section>
      </section>
    );
  }
}
