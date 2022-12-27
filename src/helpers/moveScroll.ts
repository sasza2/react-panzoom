import { MutableRefObject } from 'react';

import { Position } from 'types';
import getBoundingClientRect from './getBoundingClientRect';
import getWindowSize from './getWindowSize';
import loopParentNodes from './loopParentNodes';

const hasScroll = (node: HTMLDivElement) => node.clientHeight < node.scrollHeight;

const inNodeWindow = (node: HTMLElement | Window) => ('scrollX' in node && 'scrollY' in node);

const getScroll = (node: HTMLElement | Window): Position => {
  if (inNodeWindow(node)) {
    const windowNode = node as Window;
    return {
      x: windowNode.scrollX || 0,
      y: windowNode.scrollY || 0,
    } as Position;
  }
  const elementNode = node as HTMLElement;
  return {
    x: elementNode.scrollLeft || 0,
    y: elementNode.scrollTop || 0,
  };
};

const addScroll = (node: HTMLElement | Window, next: Position): Position => {
  if (inNodeWindow(node)) {
    node.scrollBy(next.x, next.y);
  } else {
    const elementNode = node as HTMLElement;
    elementNode.scrollLeft += next.x;
    elementNode.scrollTop += next.y;
  }

  return getScroll(node);
};

const moveScroll = (
  childRef: MutableRefObject<HTMLDivElement>,
  nextX: number,
  nextY: number,
): Position => {
  const parent = childRef.current.parentNode as HTMLDivElement;
  const parentRect = getBoundingClientRect(childRef.current.parentNode as HTMLDivElement);

  const windowSize = getWindowSize();

  const blockRight = nextX < 0 && parentRect.right > 0 && windowSize.width > parentRect.right;
  const blockLeft = nextX > 0 && parentRect.left >= 0;
  const blockHorizontal = blockRight || blockLeft;

  const blockBottom = nextY < 0 && parentRect.bottom > 0 && windowSize.height > parentRect.bottom;
  const blockTop = nextY > 0 && parentRect.top >= 0;
  const blockVertical = blockBottom || blockTop;

  const toAdd = {
    x: nextX,
    y: nextY,
  };

  if (blockHorizontal && blockVertical) return toAdd;

  loopParentNodes(parent.parentNode as HTMLDivElement)
    .forEachToWindow((node) => {
      if (!hasScroll(node)) return;

      if (!blockHorizontal) {
        let scroll = getScroll(node);
        const currentScrollLeft = scroll.x;
        scroll = addScroll(node, { x: -toAdd.x, y: 0 });
        toAdd.x += scroll.x - currentScrollLeft;
      }

      if (!blockVertical) {
        let scroll = getScroll(node);
        const currentScrollTop = scroll.y;
        scroll = addScroll(node, { x: 0, y: -toAdd.y });
        toAdd.y += scroll.y - currentScrollTop;
      }
    });

  return toAdd;
};

export default moveScroll;
