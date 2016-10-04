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
import ReticleComponent from './component';
import { mount } from 'enzyme';
import expect from 'expect';
import expectElement from 'expect-element';
import Mapbox from 'mapbox-gl/dist/mapbox-gl';
import MapboxMock from 'mapbox-gl-js-mock';

expect.extend(expectElement);

describe('<Reticle />', function () {
  let MapMock;
  let MapSpy;
  let MarkerMock;
  let MarkerSpy;
  let context;

  beforeEach('Setup', function () {
    MarkerMock = new MapboxMock.Marker();
    MarkerSpy = expect.spyOn(Mapbox, 'Marker').andReturn(MarkerMock);
    MapMock = new MapboxMock.Map({});
    MapSpy = expect.spyOn(Mapbox, 'Map').andReturn(MapMock);
    context = {
      context: {
        map: MapMock,
      },
    };
  });

  afterEach('Restore spies', function () {
    MarkerSpy.restore();
    MapSpy.restore();
  });

  describe('Mounting', function () {
    it('should not mount outside of <Map />', function () {
      let reticleWrapper;
      try {
        reticleWrapper = mount(
          <ReticleComponent />,
          {
            context: {
              map: undefined,
            },
          }
        );
      } catch (error) {
        reticleWrapper = error;
      }
      expect(reticleWrapper).toBeA(Error);
    });

    it('should create a marker on map with className props', function () {
      const addToSpy = expect.spyOn(MarkerMock, 'addTo').andCallThrough();
      mount(
        <ReticleComponent />,
        context
      );
      expect(addToSpy).toHaveBeenCalled();
    });

    it('should have an appropriate default classname', function () {
      mount(
        <ReticleComponent />,
        context
      );
      const element = document.createElement('div');
      element.classList.add('mapbox-gl-react--reticle');
      expect(MarkerSpy).toHaveBeenCalledWith(element);
    });

    it('should pass through className to component', function () {
      mount(
        <ReticleComponent className="reticle" />,
        context
      );
      const element = document.createElement('div');
      element.classList.add('c-reticle');
      expect(MarkerSpy).toHaveBeenCalledWith(element);
    });
  });

  describe('Mutation', function () {
    it('should stay at the center of the <Map />', function () {
      mount(
        <ReticleComponent />,
        context
      );
      expect(MapMock._events).toIncludeKey('move');
    });
  });

  describe('Unmounting', function () {
    it('should remove marker from <Map />', function () {
      const willUnmount = expect.spyOn(MarkerMock, 'remove');
      const reticleWrapper = mount(
        <ReticleComponent />,
        context
      );
      reticleWrapper.unmount();
      expect(willUnmount).toHaveBeenCalled();
    });
  });
});
