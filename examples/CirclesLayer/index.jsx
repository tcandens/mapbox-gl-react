import React, { Component } from 'react';
import MapComponent, { CollectionSource, Circles, query } from '../../src/';
import config from '../../config.json';

import testCollection from '../../src/CollectionSource/testCollection.json';

export default class CirclesLayerExample extends Component {
  state = {
    data: [],
  }
  componentDidMount = () => {
    this.setState({
      data: testCollection,
    });
  }
  render = () => {
    return (
      <MapComponent
        accessToken={config.mapboxToken}
        style={config.mapboxStyle}
        center={[-122.3372, 47.611]}
        pitch={0}
        zoom={12}
        eventHandlers={{
          load: map => {
            window.MAPBOX_MAP = map;
          },
        }}
      >
        <CollectionSource
          name="permits"
          collection={this.state.data}
          coordinates={['longitude', 'location.latitude']}
          properties={['value']}
          options={{
            cluster: true,
            clusterRadius: 20,
          }}
        >
          <Circles color="red" blur={0.8} radius={15} />
        </CollectionSource>
      </MapComponent>
    );
  }
}
