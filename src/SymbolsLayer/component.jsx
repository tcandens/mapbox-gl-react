import React, { PropTypes } from 'react';
import Layer from '../Layer';

export default function SymbolsLayer(props, context) {
  const {
    children,
    filter,
    image,
    size,
    color,
    offset,
    opacity,
    padding,
    paint,
    layout,
  } = props;
  const mergedLayout = Object.assign({}, layout, {
    'icon-image': image,
    'icon-size': size,
    'icon-offset': offset,
    'icon-padding': padding,
  });
  const mergedPaint = Object.assign({}, paint, {
    'icon-color': color,
    'icon-opacity': opacity,
  });
  return (
    <Layer
      type="symbol"
      layout={mergedLayout}
      paint={mergedPaint}
      filter={filter}
    />
  );
}

SymbolsLayer.propTypes = {
  image: PropTypes.string.isRequired,
  size: PropTypes.number,
  color: PropTypes.string,
  offset: PropTypes.array,
  opacity: PropTypes.number,
  padding: PropTypes.number,
  paint: PropTypes.object,
  layout: PropTypes.object,
};
SymbolsLayer.defaultProps = {
  size: 1,
  color: '#000000',
  offset: [0, 0],
  opacity: 1,
  padding: 2,
};
