import { RefObject } from 'react';

import { Position } from 'types';
import { usePanZoom } from '@/context';
import getBoundingClientRect from '@/helpers/getBoundingClientRect';
import getScrollOffset from '@/helpers/getScrollOffset';
import positionFromEvent from '@/helpers/positionFromEvent';
import produceElementPosition from '@/helpers/produceElementPosition';

type useElementMouseDownPositionThunk = (
  e: MouseEvent | TouchEvent,
  elementRef: RefObject<HTMLDivElement>
) => Position;

export const useElementMouseDownPosition = (): useElementMouseDownPositionThunk => {
  const { childRef, zoomRef } = usePanZoom();

  return (e, elementRef) => {
    const eventPosition = positionFromEvent(e);
    const parent = getBoundingClientRect(childRef.current.parentNode as HTMLDivElement);
    const rect = getBoundingClientRect(elementRef.current);
    const scroll = getScrollOffset(childRef);

    return {
      x: (eventPosition.clientX - rect.left + parent.left + scroll.x) / zoomRef.current,
      y: (eventPosition.clientY - rect.top + parent.top + scroll.y) / zoomRef.current,
    };
  };
};

type UseElementMouseMovePosition = (
  e: MouseEvent | TouchEvent,
  from: Position,
  elementRef: RefObject<HTMLDivElement>
) => Position;

export const useElementMouseMovePosition = (): UseElementMouseMovePosition => {
  const { childRef, positionRef, zoomRef } = usePanZoom();
  return (e, from, elementRef) => {
    const eventPosition = positionFromEvent(e);
    const scroll = getScrollOffset(childRef);

    return produceElementPosition({
      element: elementRef.current,
      container: childRef.current,
      x: (eventPosition.clientX - positionRef.current.x + scroll.x) / zoomRef.current - from.x,
      y: (eventPosition.clientY - positionRef.current.y + scroll.y) / zoomRef.current - from.y,
      zoom: zoomRef.current,
    });
  };
};
