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
import SourceComponent from './component';
import { mount } from 'enzyme';
import expect from 'expect';
import point from 'turf-point';
import config from '../../config.json';

/**
 * Higher Order Test Components
 */
class TestMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mountChildren: true,
    };
  }
  render() {
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
        {this.state.mountChildren && children}
      </MapComponent>
    );
  }
}
class TestMapWithSource extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: point([42, 42]),
    };
  }
  render() {
    return (
      <TestMap
        {...this.props}
      >
        <SourceComponent name="test" data={this.state.data} />
      </TestMap>
    );
  }
}

describe('<Source/>', function () {
  describe('Mounting', function () {
    it('should only work inside a map', function () {
      let TestSource;
      try {
        TestSource = mount(
          <SourceComponent name="test" data={point([-122, 47])} />
        );
      } catch (error) {
        TestSource = error;
      }
      expect(TestSource).toBeA(Error);
    });
    it('should add source to map', function (done) {
      this.timeout(5000);
      function continueTest(map) {
        const source = map.getSource('test');
        expect(source).toExist();
        done();
      }
      mount(
        <TestMap
          eventHandlers={{
            load: continueTest,
          }}
        >
          <SourceComponent name="test" data={point([-122, 47])} />
        </TestMap>
      );
    });
  });

  describe('Mutation', function () {
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

  describe('Unmounting', function () {
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
