import { Boundary, BoundaryProp, Position } from 'types';
import lineToVariable from './lineToVariable';

type Size = {
  width: number;
  height: number;
};

type PositionVerticalProps = {
  boundary: Boundary;
  y: number;
  parentSize: Size;
  childSize: Size;
};

const positionVertical = ({
  boundary,
  y,
  parentSize,
  childSize,
}: PositionVerticalProps): number => {
  const diff = Math.max(childSize.height - parentSize.height, 0); // px
  if (boundary.top === undefined && boundary.bottom === undefined) return y;
  if (boundary.top !== undefined && boundary.bottom === undefined) {
    return Math.max(y, (boundary.top as number) - diff);
  }
  if (boundary.top === undefined && boundary.bottom !== undefined) {
    return Math.min(y, (boundary.bottom as number) - childSize.height + diff);
  }

  const top = (boundary.top as number) - diff; // px
  if (y < top) return top;

  const bottom = (boundary.bottom as number) - childSize.height + diff; // px
  if (y > bottom) return bottom;

  return y;
};

type PositionHorizontalProps = {
  boundary: Boundary;
  x: number;
  parentSize: Size;
  childSize: Size;
};

const positionHorizontal = ({
  boundary,
  x,
  parentSize,
  childSize,
}: PositionHorizontalProps): number => {
  const diff = Math.max(childSize.width - parentSize.width, 0); // px
  if (boundary.left === undefined && boundary.right === undefined) return x;
  if (boundary.left !== undefined && boundary.right === undefined) {
    return Math.max(x, (boundary.left as number) - diff);
  }
  if (boundary.left === undefined && boundary.right !== undefined) {
    return Math.min(x, (boundary.right as number) - childSize.width + diff);
  }

  const leftMax = (boundary.left as number) - diff; // px
  if (x < leftMax) return leftMax;

  const rightMax = (boundary.right as number) - childSize.width + diff; // px
  if (x > rightMax) return rightMax;

  return x;
};

type MeasureBoundaryProps = {
  boundary: BoundaryProp;
  parentSize: Size;
  childSize: Size;
};

const measureBoundary = ({
  boundary,
  parentSize,
  childSize,
}: MeasureBoundaryProps): Boundary => {
  if (!boundary) {
    return {
      top: undefined,
      right: undefined,
      bottom: undefined,
      left: undefined,
    };
  }

  const variables = {
    containerWidth: parentSize.width,
    containerHeight: parentSize.height,
    childWidth: childSize.width,
    childHeight: childSize.height,
  };

  const defaults = {
    top: 0,
    left: 0,
    right: 'containerWidth',
    bottom: 'containerHeight',
  };

  const directions = ['top', 'left', 'right', 'bottom'] as const;
  return directions.reduce((obj, direction) => {
    const passedValue = boundary === true ? undefined : boundary[direction];
    const nextDirectionValue = lineToVariable(
      passedValue === undefined ? defaults[direction] : passedValue,
      variables,
    );
    return {
      ...obj,
      [direction]: nextDirectionValue,
    };
  }, {});
};

type ProduceBoundingProps = {
  boundary: BoundaryProp;
  x: number;
  y: number;
  parentSize: Size;
  childSize: Size;
};

const produceBounding = ({
  boundary,
  x,
  y,
  parentSize,
  childSize,
}: ProduceBoundingProps): Position => {
  const boundaryNext = measureBoundary({ boundary, parentSize, childSize });
  const nextPosition: Partial<Position> = {};
  nextPosition.x = positionHorizontal({
    boundary: boundaryNext,
    x,
    parentSize,
    childSize,
  });
  nextPosition.y = positionVertical({
    boundary: boundaryNext,
    y,
    parentSize,
    childSize,
  });
  return nextPosition as Position;
};

export default produceBounding;
