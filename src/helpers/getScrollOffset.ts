import { MutableRefObject } from 'react';

import { Position } from 'types';

const getScrollOffset = (childRef: MutableRefObject<HTMLDivElement>): Position => {
  const parent: HTMLDivElement = childRef.current.parentNode as HTMLDivElement;
  let node = parent.parentNode as HTMLDivElement;

  const scroll = {
    x: 0,
    y: 0,
  };

  while (node) {
    scroll.x += node.scrollLeft || 0;
    scroll.y += node.scrollTop || 0;
    node = node.parentNode as HTMLDivElement;
  }

  return scroll;
};

export default getScrollOffset;
