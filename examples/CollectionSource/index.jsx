import React, { Component } from 'react';
import MapComponent, { CollectionSource, Layer, query } from '../../src/';
import config from '../../config.json';

import testCollection from '../../src/CollectionSource/testCollection.json';

export default class CollectionSourceExample extends Component {
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
        center={[-122.3372, 47.6111]}
        pitch={0}
        zoom={12}
        eventHandlers={{
          load: map => {
            window.MAPBOX_MAP = map;
          },
          click: (map, event) => {
            const features = query(map).renderedWithin(5, event);
            console.log(features);
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
          }}
        >
          <Layer type="circle" paint={{ 'circle-color': 'red' }} layout={{ visibility: 'visible' }} />
        </CollectionSource>
      </MapComponent>
    );
  }
}
