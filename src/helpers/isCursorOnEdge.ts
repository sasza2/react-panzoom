import { MutableRefObject } from 'react';

import { CURSOR_ON_EDGE_MARGIN } from '@/consts';
import { ClientPosition } from 'types';
import getBoundingClientRect from './getBoundingClientRect';
import getWindowSize from './getWindowSize';
import loopParentNodes from './loopParentNodes';

type Edges = {
  top: boolean;
  bottom: boolean;
  left: boolean;
  right: boolean;
};

const isCursorOnEdge = (childRef: MutableRefObject<HTMLDivElement>, e: ClientPosition): Edges => {
  const childRect = getBoundingClientRect(childRef.current);
  const parentRect = getBoundingClientRect(childRef.current.parentNode as HTMLDivElement);
  const offsetX = parentRect.left > 0 ? parentRect.left : 0;
  const offsetY = parentRect.top > 0 ? parentRect.top : 0;
  const windowSize = getWindowSize();

  let startX = childRect.left - offsetX;
  if (startX < 0) startX = 0;

  let startY = childRect.top - offsetY;
  if (startY < 0) startY = 0;

  const horizontalBoundary = [
    windowSize.width - offsetX,
    childRect.right,
    parentRect.right - CURSOR_ON_EDGE_MARGIN,
    parentRect.right - parentRect.left,
  ];

  const verticalBoundary = [
    windowSize.height - offsetY,
    childRect.bottom,
    parentRect.bottom - CURSOR_ON_EDGE_MARGIN,
    parentRect.bottom - parentRect.top,
  ];

  loopParentNodes(childRef.current.parentNode as HTMLDivElement)
    .forEach((node) => {
      const rect = getBoundingClientRect(node);

      if (rect.right > 0) horizontalBoundary.push(rect.right - offsetX);
      if (rect.bottom > 0) verticalBoundary.push(rect.bottom - offsetY);
    });

  const endX = Math.min(...horizontalBoundary);
  const endY = Math.min(...verticalBoundary);

  const mousePositionX = e.clientX - offsetX;
  const mousePositionY = e.clientY - offsetY;

  const edges = {
    top: false,
    bottom: false,
    left: false,
    right: false,
  };

  if (startX + CURSOR_ON_EDGE_MARGIN > mousePositionX) edges.left = true;
  else if (mousePositionX + CURSOR_ON_EDGE_MARGIN > endX) edges.right = true;
  if (startY + CURSOR_ON_EDGE_MARGIN > mousePositionY) edges.top = true;
  else if (mousePositionY + CURSOR_ON_EDGE_MARGIN > endY) edges.bottom = true;

  return edges;
};

export default isCursorOnEdge;
