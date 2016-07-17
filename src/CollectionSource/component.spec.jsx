/* eslint-env mocha */
/*
  eslint func-names: "off",
  prefer-arrow-callback: "off",
  quote-props: "off",
  dot-notation: "off",
  react/prop-types: "off",
  react/no-multi-comp: "off",
*/
import React, { Component } from 'react';
import MapComponent from '../Map';
import CollectionSource from './component';
import { mount } from 'enzyme';
import expect from 'expect';
import point from 'turf-point';
import turfRandom from 'turf-random';
import featureCollection from 'turf-featurecollection';
import config from '../../config.json';

import testCollection from './testCollection.json';

class TestMap extends Component {
  state = {
    renderChildren: true,
    data: {},
  }
  render = () => {
    const {
      children,
      ...custom,
    } = this.props;
    return (
      <MapComponent
        accessToken={config.mapboxToken}
        style={config.mapboxStyle}
        center={[-122, 47]}
        zoom={2}
        {...custom}
      >
        {this.state.renderChildren && children}
      </MapComponent>
    );
  }
}

describe.skip('<CollectionSource/>', function () {
  describe('Mounting', function () {
    it('should not work outside of a map', function () {
      let source;
      try {
        source = mount(
          <CollectionSource
            name="test"
            collection={testCollection}
            coordinates={['longitude', 'location.latitude']}
            properties={['value']}
          />
        );
      } catch (error) {
        source = error;
      }
      expect(source).toBeA(Error);
    });
    it('should noop if collection is empty', function (done) {
      function continueTest(map) {
        done();
      }
      const mapWrapper = mount(
        <TestMap
          eventHandlers={{
            load: continueTest,
          }}
        >
          <CollectionSource
            name="test"
            collection={{}}
            coordinates={['longitude', 'location.latitude']}
            properties={['value']}
          />
        </TestMap>
      );
    });
    it('should take a collection, translate it to geoJSON and add generic source');
  });
  describe('Mutation', function () {
    it('should update source on data change');
  });
  describe('Unmounting', function () {
    it('should remove source from map');
  });
});
