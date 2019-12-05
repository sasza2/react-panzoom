const isNumber = (number) => !Number.isNaN(number);

const maxParamValue = ({
  min, max, value,
}) => {
  if (isNumber(min) && value < min) return min;
  if (isNumber(max) && value > max) return max;
  return value;
};

const produceBounding = ({
  boundary, x, y, zoom,
}) => {
  const nextPosition = { x, y };
  if (isNumber(boundary.top) || isNumber(boundary.bottom)) {
    nextPosition.y = maxParamValue({
      min: boundary.top * zoom,
      max: boundary.bottom * zoom,
      value: y,
    });
  }
  if (isNumber(boundary.left) || isNumber(boundary.right)) {
    nextPosition.x = maxParamValue({
      min: boundary.left * zoom,
      max: boundary.right * zoom,
      value: x,
    });
  }

  return nextPosition;
};

export default produceBounding;
