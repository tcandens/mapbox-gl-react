import React, { Component } from 'react';
import MapComponent, { CollectionSource, Circles, Layer, query } from '../../src';
import config from '../../config.json';

import testCollection from '../../src/CollectionSource/testCollection.json';

import './style.sass';

export default class QueriesExample extends Component {
  state = {
    data: [],
    viewing: [],
  }
  componentDidMount = () => {
    this.setState({
      data: testCollection,
    });
  }
  get clearViewing() {
    this.setState({
      ...this.state,
      viewing: [],
    });
  }
  get renderViewing() {
    const {
      viewing,
    } = this.state;
    const features = viewing.map((item, index) => (
      <li key={index}>{`$${item.properties.value}`}</li>
    ));
    return (
      <ul className="viewing">
        {features}
        <li className="exit"><button onClick={() => this.clearViewing}>X</button></li>
      </ul>
    );
  }
  render = () => {
    return (
      <section className="queries-example">
        {!!this.state.viewing.length && this.renderViewing}
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
              const features = query(map).renderedWithin(10, event);
              this.setState({
                ...this.state,
                viewing: features,
              });
            },
          }}
        >
          <CollectionSource
            name="permits"
            collection={this.state.data}
            coordinates={['longitude', 'location.latitude']}
            properties={['value']}
          >
            <Circles color="blue" />
          </CollectionSource>
        </MapComponent>
      </section>
    );
  }
}
