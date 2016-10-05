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
import LayerComponent from './component';
import { mount } from 'enzyme';
import expect from 'expect';
import MapboxMock from 'mapbox-gl-js-mock';

describe('<Layer/>', function () {
  let MapMock;
  let context;
  beforeEach('Setup', function () {
    MapMock = new MapboxMock.Map({});
    context = {
      context: {
        map: MapMock,
        sourceName: 'test',
      },
    };
  });
  describe('Mounting', function () {
    it('should not mount outside of a <Source> component', function () {
      let layerWrapper;
      try {
        layerWrapper = mount(
          <LayerComponent
            type="circle"
          />, {
            context: {
              map: undefined,
              sourceName: undefined,
            },
          }
        );
      } catch (error) {
        layerWrapper = error;
      }
      expect(layerWrapper).toBeA(Error);
    });

    it('should add a layer to map', function () {
      const addLayerSpy = expect.spyOn(MapMock, 'addLayer');
      mount(
        <LayerComponent type="circle" />,
        context
      );
      expect(addLayerSpy).toHaveBeenCalled();
    });

    it('should create unique layer name to avoid collisions', function () {
      const addLayerSpy = expect.spyOn(MapMock, 'addLayer');
      mount(
        <LayerComponent type="circle" />,
        context
      );
      const { id } = addLayerSpy.calls[0].arguments[0];
      expect(id).toMatch(/test-circle-\d+/);
    });
  });
  describe('Mutation', function () {
  });
  describe('Unmounting', function () {
    it('should remove layer from map', function () {
      const removeLayerSpy = expect.spyOn(MapMock, 'removeLayer');
      const layerWrapper = mount(
        <LayerComponent type="circle" />,
        context
      );
      layerWrapper.unmount();
      expect(removeLayerSpy).toHaveBeenCalled();
    });
  });
});
