import React, { PropTypes } from 'react';
import Layer from '../Layer';

export default function CirclesLayer(props, context) {
  const {
    children,
    filter,
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
      filter={filter}
    />
  );
}
CirclesLayer.propTypes = {
  blur: PropTypes.number,
  color: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
  ]),
  radius: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
  ]),
  opacity: PropTypes.number,
  translate: PropTypes.array,
};
