export function getAllUserLayers(map) {
  const nameSchema = /MAPBOX-GL-REACT_/;
  const layers = Object.keys(map.style._layers); // eslint-disable-line
  return layers.filter(layer => nameSchema.test(layer));
}
export function queryRenderedWithin(map, distance, event) {
  const userLayers = getAllUserLayers(map);
  const { x, y } = event.point;
  const features = map.queryRenderedFeatures(
    [
      [x - distance / 2, y - distance / 2],
      [x + distance / 2, y + distance / 2],
    ],
    {
      layers: userLayers,
    }
  );
  return features;
}
// Fluent api with partially applied versions of query helpers
export function query(map) {
  return {
    renderedWithin: queryRenderedWithin.bind(undefined, map),
  };
}
/* eslint-disable no-param-reassign */
// Decorator for monkey-patching entire map
export default function decorator(map) {
  map.queryRenderedWithin = queryRenderedWithin.bind(undefined, map);
  return map;
}
