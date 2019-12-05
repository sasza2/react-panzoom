const positionVertical = ({
  boundary, y, rect,
}) => {
  let boundaryTop = boundary.top === undefined ? -Number.MAX_SAFE_INTEGER : boundary.top;
  let boundaryBottom = boundary.bottom === undefined ? Number.MAX_SAFE_INTEGER : boundary.bottom;

  const boundingHeight = rect.height - boundaryBottom - boundaryTop;
  if (boundingHeight > 0) {
    boundaryTop -= boundingHeight;
    boundaryBottom += boundingHeight;
  }

  if (y < boundaryTop) return boundaryTop;

  const max = boundaryBottom - rect.height;
  return y > max ? max : y;
};

const positionHorizontal = ({
  boundary, x, rect,
}) => {
  let boundaryLeft = boundary.left === undefined ? -Number.MAX_SAFE_INTEGER : boundary.left;
  let boundaryRight = boundary.right === undefined ? Number.MAX_SAFE_INTEGER : boundary.right;

  const boundingHeight = rect.height - boundaryRight - boundaryLeft;
  if (boundingHeight > 0) {
    boundaryLeft -= boundingHeight;
    boundaryRight += boundingHeight;
  }

  if (x < boundaryLeft) return boundaryLeft;

  const max = boundaryRight - rect.height;
  return x > max ? max : x;
};

const produceBounding = ({
  boundary, x, y, rect,
}) => {
  const nextPosition = { x, y };
  nextPosition.x = positionHorizontal({ boundary, x, rect });
  nextPosition.y = positionVertical({ boundary, y, rect });
  return nextPosition;
};

export default produceBounding;
