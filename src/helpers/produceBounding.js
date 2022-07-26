import lineToVariable from './lineToVariable';

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
    return Math.min(x, boundary.right - rect.width + diff);
  }

  const leftMax = boundary.left - diff; // px
  if (x < leftMax) return leftMax;

  const rightMax = boundary.right - rect.width + diff; // px
  if (x > rightMax) return rightMax;

  return x;
};

const measureBoundary = ({ boundary, parent, rect }) => {
  if (!boundary) {
    return {
      top: undefined,
      right: undefined,
      bottom: undefined,
      left: undefined,
    };
  }

  const variables = {
    containerWidth: parent.width,
    containerHeight: parent.height,
    childWidth: rect.width,
    childHeight: rect.height,
  };

  const defaults = {
    top: 0,
    left: 0,
    right: 'containerWidth',
    bottom: 'containerHeight',
  };

  const directions = ['top', 'left', 'right', 'bottom'];
  return directions.reduce((obj, direction) => {
    const passedValue = boundary === true ? undefined : boundary[direction];
    const nextDirectionValue = lineToVariable(
      passedValue === undefined ? defaults[direction] : passedValue, variables,
    );
    return {
      ...obj,
      [direction]: nextDirectionValue,
    };
  }, {});
};

const produceBounding = ({
  boundary, x, y, parent, rect,
}) => {
  const boundaryNext = measureBoundary({ boundary, parent, rect });
  const nextPosition = {};
  nextPosition.x = positionHorizontal({
    boundary: boundaryNext, x, parent, rect,
  });
  nextPosition.y = positionVertical({
    boundary: boundaryNext, y, parent, rect,
  });
  return nextPosition;
};

export default produceBounding;
