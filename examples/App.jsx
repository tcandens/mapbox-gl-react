import React from 'react';
import MapComponent from '../src/';
import config from '../config.json';

import './App.sass';

export default function App(props) {
  return (
    <MapComponent
      accessToken={config.mapboxToken}
      style={config.mapboxStyle}
      center={[-122.3372, 47.6111]}
      pitch={0}
      zoom={12}
    />
  );
}
