import React, { Component } from 'react';
import MapComponent, { CollectionSource, Circles, Symbols, query } from '../../src';
import config from '../../config.json';

const assaultsEndpoint = 'https://data.seattle.gov/resource/pu5n-trf4.json?$where=at_scene_time>\'2016-01-07T12:00:00\'&initial_type_group=ASSAULTS';
const homicidesEndpoint = 'https://data.seattle.gov/resource/pu5n-trf4.json?event_clearance_code=010&$where=at_scene_time>\'2016-01-07T12:00:00\'';

import './style.sass';

export default class LargeExample extends Component {
  state = {
    assaults: [],
    homicides: [],
    viewing: [],
  }
  componentDidMount = () => {
    fetch(assaultsEndpoint)
      .then(data => data.json())
      .then(json => {
        this.setState({
          ...this.state,
          assaults: json,
        });
      });
    fetch(homicidesEndpoint).then(data => data.json())
      .then(json => {
        this.setState({
          ...this.state,
          homicides: json,
        });
      });
  }
  get viewing() {
    const features = this.state.viewing.map((item, index) => (
      <li key={index}>
        {item.properties.hundred_block_location} -
        {item.properties.event_clearance_group} -
        {item.properties.at_scene_time}
      </li>
    ));
    return (
      <div className="viewing">
        {features}
      </div>
    );
  }
  set viewing(items) {
    this.setState({
      ...this.state,
      viewing: items,
    });
  }
  render = () => {
    return (
      <section className="large-example">
        {!!this.state.viewing.length && this.viewing}
        <MapComponent
          accessToken={config.mapboxToken}
          style="mapbox://styles/mapbox/light-v9"
          center={[-122.3372, 47.6111]}
          zoom={12}
          eventHandlers={{
            load: map => {
              window.MAPBOX_MAP = map;
            },
            click: (map, event) => {
              const features = query(map).renderedWithin(10, event);
              this.viewing = features;
            },
          }}
        >
          <CollectionSource
            name="assaults"
            collection={this.state.assaults}
            coordinates={['longitude', 'latitude']}
            properties={['hundred_block_location', 'event_clearance_group', 'at_scene_time']}
          >
            <Circles
              color={{
                property: 'event_clearance_group',
                stops: [
                ['DISTURBANCES', 'orange'],
                ['ROBBERY', 'red'],
                ['ASSAULTS', 'coral'],
                ['SHOPLIFTING', 'gray'],
                ],
              }}
              radius={5}
              blur={0.8}
              opacity={0.5}
            />
            <Symbols
              image="hospital-11"
              filter={[
                '==', 'event_clearance_group', 'BEHAVIORAL HEALTH',
              ]}
            />
          </CollectionSource>
          <CollectionSource
            name="homicides"
            collection={this.state.homicides}
            coordinates={['longitude', 'latitude']}
            properties={['hundred_block_location', 'event_clearance_group', 'at_scene_time']}
          >
            <Symbols image="cemetery-15" size={1} />
          </CollectionSource>
        </MapComponent>
      </section>
    );
  }
}
