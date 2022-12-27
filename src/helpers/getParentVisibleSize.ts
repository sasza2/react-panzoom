import { MutableRefObject } from 'react';

import getBoundingClientRect from './getBoundingClientRect';
import getWindowSize from './getWindowSize';
import loopParentNodes from './loopParentNodes';

const getParentVisibleSize = (childRef: MutableRefObject<HTMLDivElement>): [number, number] => {
  const parentRect = getBoundingClientRect(childRef.current.parentNode as HTMLDivElement);
  const windowSize = getWindowSize();

  const widths = [
    windowSize.width - (parentRect.left < 0 ? 0 : parentRect.left),
    parentRect.right,
  ];

  const heights = [
    windowSize.height - (parentRect.top < 0 ? 0 : parentRect.top),
    parentRect.bottom,
  ];

  loopParentNodes(childRef.current.parentNode as HTMLDivElement)
    .forEach((node) => {
      const rect = getBoundingClientRect(node);
      if (rect.right > 0) widths.push(rect.right - rect.left);
      if (rect.bottom > 0) heights.push(rect.bottom - rect.top);
    });

  let visibleWidth = Math.min(...widths);
  let visibleHeight = Math.min(...heights);

  if (visibleWidth < 0) visibleWidth = 0;
  if (visibleHeight < 0) visibleHeight = 0;

  return [visibleWidth, visibleHeight];
};

export default getParentVisibleSize;
