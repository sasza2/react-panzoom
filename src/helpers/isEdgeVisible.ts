import { MutableRefObject } from 'react';

import { Position } from 'types';
import getParentVisibleSize from './getParentVisibleSize';
import getScrollOffset from './getScrollOffset';

export const distanceToRightEdge = (
  childRef: MutableRefObject<HTMLDivElement>,
  positionRef: MutableRefObject<Position>,
): number => {
  const childRect = childRef.current.getBoundingClientRect();
  const scroll = getScrollOffset(childRef);
  const [visibleWidth] = getParentVisibleSize(childRef);
  const parentRect = (childRef.current.parentNode as HTMLDivElement).getBoundingClientRect();
  const parentMarginLeft = parentRect.left > 0
    ? -scroll.x
    : document.body.getBoundingClientRect().left - parentRect.left;
  const positionX = positionRef.current.x + childRect.width;

  return positionX - (visibleWidth + scroll.x + parentMarginLeft);
};

const isEdgeRightVisible = (
  childRef: MutableRefObject<HTMLDivElement>,
  positionRef: MutableRefObject<Position>,
): boolean => {
  const childRect = childRef.current.getBoundingClientRect();
  const parentRect = (childRef.current.parentNode as HTMLDivElement).getBoundingClientRect();

  const positionX = positionRef.current.x + childRect.width;

  return (
    positionX + parentRect.left > 0
    && positionX >= 0
    && distanceToRightEdge(childRef, positionRef) < 0
  );
};

export const distanceToBottomEdge = (
  childRef: MutableRefObject<HTMLDivElement>,
  positionRef: MutableRefObject<Position>,
): number => {
  const childRect = childRef.current.getBoundingClientRect();
  const scroll = getScrollOffset(childRef);
  const [, visibleHeight] = getParentVisibleSize(childRef);
  const parentRect = (childRef.current.parentNode as HTMLDivElement).getBoundingClientRect();
  const parentMarginTop = parentRect.top > 0
    ? -scroll.y
    : document.body.getBoundingClientRect().top - parentRect.top;
  const positionY = positionRef.current.y + childRect.height;

  return positionY - (visibleHeight + scroll.y + parentMarginTop);
};

const isEdgeBottomVisible = (
  childRef: MutableRefObject<HTMLDivElement>,
  positionRef: MutableRefObject<Position>,
): boolean => {
  const childRect = childRef.current.getBoundingClientRect();
  const parentRect = (childRef.current.parentNode as HTMLDivElement).getBoundingClientRect();

  const positionY = positionRef.current.y + childRect.height;

  return (
    positionY + parentRect.top > 0
    && positionY >= 0
    && distanceToBottomEdge(childRef, positionRef) < 0
  );
};

const isEdgeLeftVisible = (
  childRef: MutableRefObject<HTMLDivElement>,
  positionRef: MutableRefObject<Position>,
): boolean => {
  const scroll = getScrollOffset(childRef);
  const parentRect = (childRef.current.parentNode as HTMLDivElement).getBoundingClientRect();
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
  const parentRect = (childRef.current.parentNode as HTMLDivElement).getBoundingClientRect();
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
