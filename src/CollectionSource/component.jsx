import React, { Component, PropTypes } from 'react';
import SourceComponent from '../Source';
import at from 'lodash/at';
import point from 'turf-point';
import featureCollection from 'turf-featurecollection';

export default class CollectionSource extends Component {
  getChildContext = () => ({
    map: this.context.map,
  })
  selectProperties = (item, properties = []) => (
    properties.reduce((previous, current) => {
      previous[current] = item[current]; // eslint-disable-line
      return previous;
    }, {})
  )
  render = () => {
    const {
      name,
      children,
      collection,
      coordinates,
      properties,
      options,
    } = this.props;
    const [
      longitudeKey,
      latitudeKey,
    ] = coordinates;
    const geoJSON = featureCollection(collection.map(item => (
      point(
        [at(item, longitudeKey), at(item, latitudeKey)],
        this.selectProperties(item, properties)
      )
    )));
    return (
      <SourceComponent
        name={name}
        data={geoJSON}
        options={options}
      >
        {children}
      </SourceComponent>
    );
  }
}

CollectionSource.propTypes = {
  name: PropTypes.string.isRequired,
  collection: PropTypes.array.isRequired,
  coordinates: PropTypes.array.isRequired,
  properties: PropTypes.array,
  children: PropTypes.element,
  options: PropTypes.object,
};
CollectionSource.contextTypes = {
  map: PropTypes.object,
};
CollectionSource.childContextTypes = {
  map: PropTypes.object,
};
