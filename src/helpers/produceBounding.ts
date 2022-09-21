import { Boundary, BoundaryProp, Position } from 'types'
import lineToVariable from './lineToVariable';

type PositionVerticalProps = {
  boundary: Boundary,
  y: number,
  parent: DOMRect,
  rect: DOMRect,
}

const positionVertical = ({
  boundary, y, parent, rect,
}: PositionVerticalProps): number => {
  const diff = Math.max(rect.height - parent.height, 0); // px
  if (boundary.top === undefined && boundary.bottom === undefined) return y;
  if (boundary.top !== undefined && boundary.bottom === undefined) {
    return Math.max(y, (boundary.top as number) - diff);
  }
  if (boundary.top === undefined && boundary.bottom !== undefined) {
    return Math.min(y, (boundary.bottom as number) - rect.height + diff);
  }

  const top = (boundary.top as number) - diff; // px
  if (y < top) return top;

  const bottom = (boundary.bottom as number) - rect.height + diff; // px
  if (y > bottom) return bottom;

  return y;
};

type PositionHorizontalProps = {
  boundary: Boundary,
  x: number,
  parent: DOMRect,
  rect: DOMRect,
}

const positionHorizontal = ({
  boundary, x, parent, rect,
}: PositionHorizontalProps): number => {
  const diff = Math.max(rect.width - parent.width, 0); // px
  if (boundary.left === undefined && boundary.right === undefined) return x;
  if (boundary.left !== undefined && boundary.right === undefined) {
    return Math.max(x, (boundary.left as number) - diff);
  }
  if (boundary.left === undefined && boundary.right !== undefined) {
    return Math.min(x, (boundary.right as number) - rect.width + diff);
  }

  const leftMax = (boundary.left as number) - diff; // px
  if (x < leftMax) return leftMax;

  const rightMax = (boundary.right as number) - rect.width + diff; // px
  if (x > rightMax) return rightMax;

  return x;
};

type MeasureBoundaryProps = {
  boundary: BoundaryProp,
  parent: DOMRect,
  rect: DOMRect,
}

const measureBoundary = ({ boundary, parent, rect }: MeasureBoundaryProps): Boundary => {
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

  const directions = ['top', 'left', 'right', 'bottom'] as const;
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

type ProduceBoundingProps = {
  boundary: BoundaryProp,
  x: number,
  y: number,
  parent: DOMRect,
  rect: DOMRect,
}

const produceBounding = ({
  boundary, x, y, parent, rect,
}: ProduceBoundingProps): Position => {
  const boundaryNext = measureBoundary({ boundary, parent, rect });
  const nextPosition: Partial<Position> = {};
  nextPosition.x = positionHorizontal({
    boundary: boundaryNext, x, parent, rect,
  });
  nextPosition.y = positionVertical({
    boundary: boundaryNext, y, parent, rect,
  });
  return nextPosition as Position;
};

export default produceBounding;
