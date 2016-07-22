import React, { PropTypes } from 'react';
import Layer from '../Layer';

export default function CirclesLayer(props, context) {
  const {
    children,
    ...paintProps,
  } = props;
  const paint = Object.keys(paintProps).reduce((previous, current) => {
    previous[`circle-${current}`] = paintProps[current]; // eslint-disable-line
    return previous;
  }, {});
  return (
    <Layer
      type="circle"
      paint={{ ...paint }}
    />
  );
}

CirclesLayer.propTypes = {
  blur: PropTypes.number,
  color: PropTypes.string,
  radius: PropTypes.number,
  opacity: PropTypes.number,
  translate: PropTypes.array,
};
