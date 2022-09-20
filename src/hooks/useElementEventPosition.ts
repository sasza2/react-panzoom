import { RefObject } from 'react'

import { Position } from 'types'
import { usePanZoom } from 'context';
import positionFromEvent from 'helpers/positionFromEvent';
import produceElementPosition from 'helpers/produceElementPosition';

type useElementMouseDownPositionThunk = (e: MouseEvent | TouchEvent, elementRef: RefObject<HTMLDivElement>) => Position

export const useElementMouseDownPosition = (): useElementMouseDownPositionThunk => {
  const { childRef, zoomRef } = usePanZoom();

  return (e, elementRef) => {
    const eventPosition = positionFromEvent(e);
    const parent = (childRef.current.parentNode as HTMLDivElement).getBoundingClientRect();
    const rect = elementRef.current.getBoundingClientRect();

    return {
      x: (eventPosition.clientX - rect.left + parent.left) / zoomRef.current,
      y: (eventPosition.clientY - rect.top + parent.top) / zoomRef.current,
    };
  };
};

type UseElementMouseMovePosition = (
  e: MouseEvent | TouchEvent,
  from: Position,
  elementRef: RefObject<HTMLDivElement>,
) => Position

export const useElementMouseMovePosition = (): UseElementMouseMovePosition => {
  const { childRef, positionRef, zoomRef } = usePanZoom();
  return (e, from, elementRef) => {
    const eventPosition = positionFromEvent(e);
    return produceElementPosition({
      element: elementRef.current,
      container: childRef.current,
      x: (eventPosition.clientX - positionRef.current.x) / zoomRef.current - from.x,
      y: (eventPosition.clientY - positionRef.current.y) / zoomRef.current - from.y,
      zoom: zoomRef.current,
    });
  };
};
