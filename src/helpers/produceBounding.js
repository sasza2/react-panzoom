const maxParamValue = ({
  min, max, value,
}) => {
  if (min && value < min) return min;
  if (max && value > max) return max;
  return value;
};

const produceBounding = ({
  boundary, x, y, zoom,
}) => {
  const nextPosition = { x, y };
  if (boundary.top || boundary.bottom) {
    nextPosition.y = maxParamValue({
      min: boundary.top * zoom,
      max: boundary.bottom * zoom,
      value: y,
    });
  }
  if (boundary.left || boundary.right) {
    nextPosition.x = maxParamValue({
      min: boundary.left * zoom,
      max: boundary.right * zoom,
      value: x,
    });
  }

  return nextPosition;
};

export default produceBounding;
