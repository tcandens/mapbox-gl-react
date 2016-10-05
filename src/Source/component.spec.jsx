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
import MapboxMock from 'mapbox-gl-js-mock';

const locations = {
  'seattle': [-122.3372, 47.6111],
  'ballard': [-122.3847, 47.6683],
  'new york': [-73.9744, 40.7712],
};

describe('<Source/>', function () {
  let MapMock;
  let context;
  beforeEach('Create fresh Mapbox spy', function () {
    MapMock = new MapboxMock.Map({});
    context = {
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
      const geoJSONSource = {
        type: 'geojson',
        data,
      };
      mount(
        <SourceComponent name="test" data={data} />, context
      );
      expect(addSourceSpy).toHaveBeenCalledWith('test', geoJSONSource);
    });

    it('should update state with status', function () {
      const data = point(locations['seattle']);
      const sourceWrapper = mount(
        <SourceComponent name="test" data={data} />,
        context
      );
      expect(sourceWrapper.state('added')).toBe(true);
    });

    it('should use data if it is a string as a url for source', function () {
      const addSourceSpy = expect.spyOn(MapMock, 'addSource');
      const data = 'https://test.source.json';
      const geoJSONSource = {
        type: 'geojson',
        data,
      };
      mount(
        <SourceComponent name="test" data={data} />, context
      );
      expect(addSourceSpy).toHaveBeenCalledWith('test', geoJSONSource);
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

    it('should not render childen until source is added with data', function () {
      const sourceWrapper = mount((
        <SourceComponent name="test" data={null}>
          <div className="source-child" />
        </SourceComponent>),
        context
      );
      expect(sourceWrapper.find('.source-child').length).toBe(0);
    });

    it('should render children after source is added', function () {
      const sourceWrapper = mount((
        <SourceComponent name="test">
          <div className="source-child" />
        </SourceComponent>),
        context
      );
      sourceWrapper.setState({ added: true });
      expect(sourceWrapper.render().children().length).toBe(1);
    });

    it('should render multiple children (layers) into single node', function () {
      const sourceWrapper = mount((
        <SourceComponent name="test" data={point(locations['seattle'])}>
          <div id="source-child-1" />
          <div id="source-child-2" />
        </SourceComponent>),
        context
      );
      expect(sourceWrapper.render().find('[data-mapbox-layer-group=true]').length).toBe(1);
    });
  });

  describe('Mutation', function () {
    it('should update source from data props', function () {
      const sourceWrapper = mount(
        <SourceComponent name="test" data={point(locations['seattle'])} />,
        context
      );
      const map = sourceWrapper.context('map');
      const setDataSpy = expect.spyOn(map, 'getSource').andCallThrough();
      sourceWrapper.setProps({
        data: point(locations['ballard']),
      });
      expect(setDataSpy).toHaveBeenCalled();
    });

    it('should update source if data is url string');
  });

  describe('Unmounting', function () {
    it('should remove source from map on componentWillUnmount', function () {
      const removeSourceSpy = expect.spyOn(MapMock, 'removeSource');
      const sourceWrapper = mount(
        <SourceComponent name="test" data={point(locations['seattle'])} />,
        context
      );
      sourceWrapper.unmount();
      expect(removeSourceSpy).toHaveBeenCalled();
    });
  });
});
