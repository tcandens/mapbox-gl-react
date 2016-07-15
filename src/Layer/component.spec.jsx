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
import SourceComponent from '../Source';
import LayerComponent from './component';
import { mount } from 'enzyme';
import expect from 'expect';
import point from 'turf-point';
import config from '../../config.json';

class TestMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      renderChildren: true,
      data: point([0, 0]),
    };
  }
  render() {
    const {
      eventHandlers,
      children,
    } = this.props;
    return (
      <MapComponent
        accessToken={config.mapboxToken}
        style={config.mapboxStyle}
        center={[-122, 47]}
        zoom={2}
        eventHandlers={eventHandlers}
      >
        <SourceComponent name="test" data={this.state.data}>
          {this.state.renderChildren ? children : null}
        </SourceComponent>
      </MapComponent>
    );
  }
}

describe('<Layer/>', function () {
  describe('Mounting', function () {
    it('should not mount outside of a <Source> component', function (done) {
      let layerWrapper;
      try {
        layerWrapper = mount(
          <LayerComponent type="circle" paint={{ 'circle-color': 'red' }} />
        );
      } catch (error) {
        layerWrapper = error;
      }
      expect(layerWrapper).toBeA(Error);
      done();
    });

    it('should add a layer to map', function (done) {
      this.timeout(5000);
      function continueTest(map) {
        const layers = Object.keys(map.style._layers); // eslint-disable-line
        const found = layers.find(layer => layer.match(/test-circle/));
        expect(found).toExist();
        done();
      }
      mount(
        <TestMap
          eventHandlers={{
            load: continueTest,
          }}
        >
          <LayerComponent type="circle" paint={{ 'circle-color': 'red' }} />
        </TestMap>
      );
    });

    it('should add multiple layers to map', function (done) {
      this.timeout(5000);
      function continueTest(map) {
        const layers = Object.keys(map.style._layers); // eslint-disable-line
        const found = layers.find(layer => layer.match(/test-circle/));
        expect(found).toExist();
        done();
      }
      mount(
        <TestMap
          eventHandlers={{
            load: continueTest,
          }}
        >
          <LayerComponent type="circle" />
          <LayerComponent type="circle" />
        </TestMap>
      );
    });
  });
  describe('Mutation', function () {
  });
  describe('Unmounting', function () {
    it('should remove layer from map', function (done) {
      this.timeout(5000);
      function continueTest(map) {
        const layers = Object.keys(map.style._layers); // eslint-disable-line
        const found = layers.find(layer => layer.match(/test-circle/));
        expect(found).toNotExist();
        done();
      }
      const mapWrapper = mount(
        <TestMap
          eventHandlers={{
            load: (map) => {
              mapWrapper.setState({
                data: mapWrapper.state('data'),
                renderChildren: false,
              });
              continueTest(map);
            },
          }}
        >
          <LayerComponent type="circle" />
        </TestMap>
      );
    });
  });
});
