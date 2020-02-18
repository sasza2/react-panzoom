const positionVertical = ({
  boundary, y, parent, rect,
}) => {
  const diff = Math.max(rect.height - parent.height, 0); // px
  if (boundary.top === undefined && boundary.bottom === undefined) return y;
  if (boundary.top !== undefined && boundary.bottom === undefined) {
    return Math.max(y, boundary.top - diff);
  }
  if (boundary.top === undefined && boundary.bottom !== undefined) {
    return Math.min(y, boundary.bottom - rect.height + diff);
  }

  const top = boundary.top - diff; // px
  if (y < top) return top;

  const bottom = boundary.bottom - rect.height + diff; // px
  if (y > bottom) return bottom;

  return y;
};

const positionHorizontal = ({
  boundary, x, rect, parent,
}) => {
  const diff = Math.max(rect.width - parent.width, 0); // px
  if (boundary.left === undefined && boundary.right === undefined) return x;
  if (boundary.left !== undefined && boundary.right === undefined) {
    return Math.max(x, boundary.left - diff);
  }
  if (boundary.left === undefined && boundary.right !== undefined) {
    return Math.min(x, boundary.right - rect.height + diff);
  }

  const leftMax = boundary.left - diff; // px
  if (x < leftMax) return leftMax;

  const rightMax = boundary.right - rect.width + diff; // px
  if (x > rightMax) return rightMax;

  return x;
};

const withParent = ({ boundary, parent }) => {
  if (!boundary.parent) return boundary;

  return {
    top: boundary.top || 0,
    right: parent.width + (boundary.right || 0),
    bottom: parent.height + (boundary.bottom || 0),
    left: boundary.left || 0,
  };
};

const produceBounding = ({
  boundary, x, y, parent, rect,
}) => {
  const boundaryNext = withParent({ boundary, parent });
  const nextPosition = { x, y };
  nextPosition.x = positionHorizontal({
    boundary: boundaryNext, x, parent, rect,
  });
  nextPosition.y = positionVertical({
    boundary: boundaryNext, y, parent, rect,
  });
  return nextPosition;
};

export default produceBounding;
