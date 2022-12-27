import { MutableRefObject } from 'react';

import { Position } from 'types';
import getBoundingClientRect from './getBoundingClientRect';
import getParentVisibleSize from './getParentVisibleSize';
import getScrollOffset from './getScrollOffset';

export const distanceToRightEdge = (
  childRef: MutableRefObject<HTMLDivElement>,
): number => {
  const [width] = getParentVisibleSize(childRef);
  const childRect = getBoundingClientRect(childRef.current);
  const parentRect = getBoundingClientRect(childRef.current.parentNode as HTMLDivElement);
  const marginLeft = Math.max(parentRect.left, 0);

  return childRect.right - width - marginLeft;
};

const isEdgeRightVisible = (
  childRef: MutableRefObject<HTMLDivElement>,
  positionRef: MutableRefObject<Position>,
): boolean => {
  const childRect = getBoundingClientRect(childRef.current);
  const parentRect = getBoundingClientRect(childRef.current.parentNode as HTMLDivElement);

  const positionX = positionRef.current.x + childRect.width;

  return (
    positionX + parentRect.left > 0
    && positionX >= 0
    && distanceToRightEdge(childRef) <= 0
  );
};

export const distanceToBottomEdge = (
  childRef: MutableRefObject<HTMLDivElement>,
): number => {
  const [, height] = getParentVisibleSize(childRef);
  const childRect = getBoundingClientRect(childRef.current);
  const parentRect = getBoundingClientRect(childRef.current.parentNode as HTMLDivElement);
  const marginTop = Math.max(parentRect.top, 0);

  return childRect.bottom - height - marginTop;
};

const isEdgeBottomVisible = (
  childRef: MutableRefObject<HTMLDivElement>,
  positionRef: MutableRefObject<Position>,
): boolean => {
  const childRect = getBoundingClientRect(childRef.current);
  const parentRect = getBoundingClientRect(childRef.current.parentNode as HTMLDivElement);

  const positionY = positionRef.current.y + childRect.height;

  return (
    positionY + parentRect.top > 0
    && positionY >= 0
    && distanceToBottomEdge(childRef) <= 0
  );
};

const isEdgeLeftVisible = (
  childRef: MutableRefObject<HTMLDivElement>,
  positionRef: MutableRefObject<Position>,
): boolean => {
  const scroll = getScrollOffset(childRef);
  const parentRect = getBoundingClientRect(childRef.current.parentNode as HTMLDivElement);
  const [visibleWidth] = getParentVisibleSize(childRef);

  return (
    positionRef.current.x + parentRect.left > 0
    && positionRef.current.x >= 0
    && positionRef.current.x < visibleWidth + scroll.x
  );
};

const isEdgeTopVisible = (
  childRef: MutableRefObject<HTMLDivElement>,
  positionRef: MutableRefObject<Position>,
): boolean => {
  const scroll = getScrollOffset(childRef);
  const parentRect = getBoundingClientRect(childRef.current.parentNode as HTMLDivElement);
  const [, visibleHeight] = getParentVisibleSize(childRef);

  return (
    positionRef.current.y + parentRect.top > 0
    && positionRef.current.y >= 0
    && positionRef.current.y < visibleHeight + scroll.y
  );
};

export default {
  left: isEdgeLeftVisible,
  right: isEdgeRightVisible,
  top: isEdgeTopVisible,
  bottom: isEdgeBottomVisible,
};
