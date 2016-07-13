/* eslint-env mocha */
import React from 'react';
import MapComponent from './Map';
import { shallow, mount } from 'enzyme';
import expect from 'expect';
import config from '../config.json';

describe('Map component', () => {
  const Map = shallow(
    <MapComponent
      accessToken={config.mapboxToken}
      style={config.mapboxStyle}
      center={[-122.3372, 47.6111]}
      pitch={0}
      zoom={12}
    />
  );
  it('should render with class', () => {
    expect(Map).toExist();
  });
});
