/* eslint-env mocha */
/*
  eslint func-names: "off",
  prefer-arrow-callback: "off",
  quote-props: "off",
  dot-notation: "off",
  react/prop-types: "off"
*/
import React from 'react';
import MapComponent from './component';
import { mount } from 'enzyme';
import expect from 'expect';
import config from '../../config.json';

const locations = {
  'seattle': [-122.3372, 47.6111],
  'ballard': [-122.3847, 47.6683],
  'new york': [-73.9744, 40.7712],
};

function TestMap(props) {
  return (
    <MapComponent
      accessToken={config.mapboxToken}
      style={config.mapboxStyle}
      {...props}
    />
  );
}

describe('<Map/>', function () {
  describe('Mounting', function () {
    const Map = mount(
      <TestMap
        center={locations['seattle']}
        zoom={12}
      />
    );
    it('should get class .mapboxgl-map from Mapbox-gl', function () {
      const hasMapboxClasses = Map.find('.mapbox-gl-container').hasClass('mapboxgl-map');
      expect(hasMapboxClasses).toBe(true);
    });
    it('should contain a mapbox-canvas-container', function () {
      const canvasContainer = Map.find('.mapboxgl-canvas-container');
      expect(canvasContainer).toExist();
    });
  });

  describe('Unmounting', function () {
    it('should call map#remove on componentWillUnmount', function (done) {
      this.timeout(10000);
      const Map = mount(
        <TestMap
          center={locations['seattle']}
          zoom={12}
          eventHandlers={{
            load: (map) => {
              const removeSpy = expect.spyOn(map, 'remove');
              Map.unmount();
              expect(removeSpy).toHaveBeenCalled();
              done();
            },
          }}
        />
      );
    });
  });

  describe('Morphing props', function () {
    it('should transition map to new center', function (done) {
      this.timeout(10000);
      const Map = mount(
        <TestMap
          center={locations['seattle']}
          zoom={12}
          eventHandlers={{
            moveend: (map) => {
              // Center will not match center props exactly due to
              // JavaScript maths, but they should be within an
              // acceptable range.
              const { lng, lat } = map.getCenter();
              const lngDiff = Math.abs(lng - locations['ballard'][0]);
              const latDiff = Math.abs(lat - locations['ballard'][1]);
              const tolerance = 0.000001;
              expect(lngDiff).toBeLessThan(tolerance);
              expect(latDiff).toBeLessThan(tolerance);
              done();
            },
          }}
        />
      );
      Map.setProps({ center: locations['ballard'] });
    });
  });
});
