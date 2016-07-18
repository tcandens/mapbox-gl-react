/* eslint-env mocha */
/*
  eslint func-names: "off",
  prefer-arrow-callback: "off",
  quote-props: "off",
  dot-notation: "off",
  react/prop-types: "off",
  react/no-multi-comp: "off",
*/
import React from 'react';
import SourceComponent from './component';
import { mount } from 'enzyme';
import expect from 'expect';
import point from 'turf-point';
import Mapbox from 'mapbox-gl/dist/mapbox-gl';
import MapboxMock from 'mapbox-gl-js-mock';

const locations = {
  'seattle': [-122.3372, 47.6111],
  'ballard': [-122.3847, 47.6683],
  'new york': [-73.9744, 40.7712],
};

describe('<Source/>', function () {
  let MapMock;
  let ContextMap;
  beforeEach('Create fresh Mapbox spy', function () {
    MapMock = new MapboxMock.Map({});
    ContextMap = {
      context: {
        map: MapMock,
      },
    };
  });

  describe('Mounting', function () {
    it('should only work inside a map', function () {
      let sourceWrapper;
      try {
        sourceWrapper = mount(
          <SourceComponent />,
          {
            context: {
              map: null,
            },
          }
        );
      } catch (error) {
        sourceWrapper = error;
      }
      expect(sourceWrapper).toBeA(Error);
    });
    it('should add source to map', function () {
      const addSourceSpy = expect.spyOn(MapMock, 'addSource');
      const data = point(locations['seattle']);
      const geoJSONSource = new Mapbox.GeoJSONSource({ data });
      mount(
        <SourceComponent name="test" data={data} />, ContextMap
      );
      expect(addSourceSpy).toHaveBeenCalledWith('test', geoJSONSource);
    });
    it('should update state with source');
    it.skip('should use data if it is a string as a url for source', function () {
      const addSourceSpy = expect.spyOn(MapMock, 'addSource');
      const data = 'https://test.source.json';
      mount(
        <SourceComponent name="test" data={data} />, ContextMap
      );
      expect(addSourceSpy).toHaveBeenCalledWith('test', data);
    });
    it('should noop if data is empty', function () {
      const addSourceSpy = expect.spyOn(MapMock, 'addSource');
      const data = null;
      mount(
        <SourceComponent name="test" data={data} />,
        {
          context: {
            map: MapMock,
          },
        }
      );
      expect(addSourceSpy).toNotHaveBeenCalled();
    });
  });

  describe.skip('Mutation', function () {
    it('should update source from data props', function (done) {
      this.timeout(5000);
      const mapWrapper = mount(
        <TestMapWithSource
          eventHandlers={{
            load: (map) => {
              const newDatapoint = point([-122, 47]);
              mapWrapper.setState({
                data: newDatapoint,
              });
              const source = map.getSource('test');
              expect(source._data).toContain(newDatapoint); // eslint-disable-line
              done();
            },
          }}
        />
      );
    });
    it('should update source if data is url string');
  });

  describe.skip('Unmounting', function () {
    it('should remove source from map on componentWillUnmount', function (done) {
      this.timeout(5000);
      function continueTest(map) {
        const source = map.getSource('test');
        expect(source).toNotExist();
        done();
      }
      const MapWrapper = mount(
        <TestMap
          eventHandlers={{
            load: (map) => {
              MapWrapper.setState({
                mountChildren: false,
              });
              continueTest(map);
            },
          }}
        >
          <SourceComponent name="test" data={point([-122, 47])} />
        </TestMap>
      );
    });
  });
});
