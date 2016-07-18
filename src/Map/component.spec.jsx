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
import { shallow, mount } from 'enzyme';
import expect from 'expect';
import expectElement from 'expect-element';
import config from '../../config.json';
import Mapbox from 'mapbox-gl/dist/mapbox-gl';
import MapboxMock from 'mapbox-gl-js-mock';

expect.extend(expectElement);

const locations = {
  'seattle': [-122.3372, 47.6111],
  'ballard': [-122.3847, 47.6683],
  'new york': [-73.9744, 40.7712],
};

function TestMap(props) {
  const {
    children,
    ...more,
  } = props;
  return (
    <MapComponent
      accessToken={config.mapboxToken}
      style={config.mapboxStyle}
      center={locations['seattle']}
      zoom={2}
      {...more}
    >
      {children}
    </MapComponent>
  );
}

describe('<Map/>', function () {
  let MapboxSpy;
  let MapMock;
  beforeEach('Create Mapbox spy', function () {
    MapMock = new MapboxMock.Map({});
    MapboxSpy = expect.spyOn(Mapbox, 'Map').andReturn(MapMock);
  });
  afterEach('Restore spies', function () {
    MapboxSpy.restore();
  });
  describe('Mounting', function () {
    it('should create a map in component container ref', function () {
      mount(<TestMap />);
      const mapContainer = MapboxSpy.calls[0].arguments[0].container;
      expect(mapContainer).toHaveAttribute('class', 'mapbox-gl-container');
    });

    it('should attach eventHandlers to map', function (done) {
      const loadSpy = expect.spyOn(MapMock, 'on').andCallThrough();
      const events = [
        'onmove',
        'onmoveend',
        'click',
        'mousemove',
        'zoom',
        'rotate',
      ];
      const mockEventHandlers = events.reduce((previous, current) => {
        previous[current] = () => {}; // eslint-disable-line
        return previous;
      }, {});
      mount(
        <TestMap
          eventHandlers={{
            load: done,
            ...mockEventHandlers,
          }}
        />
      );
      expect(MapMock._events).toIncludeKeys(events); // eslint-disable-line
      expect(loadSpy).toHaveBeenCalledWith('load', done());
    });
  });

  describe('Morphing props', function () {
    it('should transition map to new center', function () {
      // Spy on Mapbox method used to transition center of camera,
      // Could change later, e.g. 'jumpTo', 'panTo', etc...
      const moveMethod = 'flyTo';
      const flyToSpy = expect.spyOn(MapMock, moveMethod);
      const mapWrapper = mount(
        <TestMap
          center={locations['seattle']}
        />
      );
      mapWrapper.setProps({ center: locations['ballard'] });
      expect(flyToSpy).toHaveBeenCalled();
    });
  });

  describe('Unmounting', function () {
    it('should call map#remove on componentWillUnmount', function () {
      const removeSpy = expect.spyOn(MapMock, 'remove').andCallThrough();
      const mapWrapper = mount(<TestMap />);
      mapWrapper.unmount();
      expect(removeSpy).toHaveBeenCalled();
    });
  });
});
