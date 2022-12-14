import { MutableRefObject } from 'react';

const getParentVisibleSize = (childRef: MutableRefObject<HTMLDivElement>): [number, number] => {
  const parentRect = (childRef.current.parentNode as HTMLDivElement).getBoundingClientRect();

  let visibleWidth = Math.min(
    window.innerWidth - (parentRect.left < 0 ? 0 : parentRect.left),
    parentRect.right - parentRect.left,
    parentRect.right,
  );
  let visibleHeight = Math.min(
    window.innerHeight - (parentRect.top < 0 ? 0 : parentRect.top),
    parentRect.bottom - parentRect.top,
    parentRect.bottom,
  );

  if (visibleWidth < 0) visibleWidth = 0;
  if (visibleHeight < 0) visibleHeight = 0;

  return [visibleWidth, visibleHeight];
};

export default getParentVisibleSize;
