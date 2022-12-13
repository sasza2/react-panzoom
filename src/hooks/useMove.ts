import { useEffect, useState,MutableRefObject } from 'react';

import { Position } from 'types'
import { usePanZoom } from 'context';
import { GRABBING_CLASS_NAME } from 'styles';
import { onMouseDown, onMouseUp, onMouseMove } from 'helpers/eventListener';
import positionFromEvent from 'helpers/positionFromEvent';
import produceBounding from 'helpers/produceBounding';
import produceStyle from 'helpers/produceStyle';
import stopEventPropagation from 'helpers/stopEventPropagation';
import useContainerMouseDownPosition from './useContainerMouseDownPosition';

type UseMove = () => MutableRefObject<Position>

const useMove: UseMove = () => {
  const [moving, setMoving] = useState<Position | null>(null);
  const {
    blockMovingRef,
    boundary,
    childRef,
    disabled,
    disabledMove,
    loading,
    onContainerChange,
    onContainerClick,
    onContainerPositionChange,
    positionRef,
    zoomRef,
  } = usePanZoom();

  const panZoomRef = childRef.current;
  const containerMouseDownPosition = useContainerMouseDownPosition();

  // Handle mousedown + mouseup
  useEffect(() => {
    if (loading) return undefined;

    const mousedown = (e: MouseEvent) => {
      const position = containerMouseDownPosition(e);
      const stop = stopEventPropagation();

      // eslint-disable-next-line no-undef
      document.body.style.userSelect = 'none';
      // eslint-disable-next-line no-undef
      document.body.classList.add(GRABBING_CLASS_NAME);

      if (onContainerClick) {
        onContainerClick({
          e,
          x: position.x / zoomRef.current,
          y: position.y / zoomRef.current,
          stop,
        });
      }
      if (disabled || disabledMove || stop.done) return;

      setMoving(position);
    };

    const mouseup = () => {
      // eslint-disable-next-line no-undef
      document.body.style.userSelect = null;
      // eslint-disable-next-line no-undef
      document.body.classList.remove(GRABBING_CLASS_NAME);
      setMoving(null);
    };

    const node = childRef.current;
    if (!node) return undefined;

    const mouseDownClear = onMouseDown(node.parentNode as HTMLDivElement, mousedown);
    const mouseUpClear = onMouseUp(node.parentNode as HTMLDivElement, mouseup);

    return () => {
      mouseDownClear();
      mouseUpClear();
    };
  }, [disabled, disabledMove, loading]);

  // Handle mousemove
  useEffect(() => {
    if (loading || !moving) return undefined;

    const move = (e: MouseEvent) => {
      if (blockMovingRef.current) return

      panZoomRef.style.transition = null

      const parentRect = (childRef.current.parentNode as HTMLDivElement).getBoundingClientRect();
      const eventPosition = positionFromEvent(e);
      const nextPosition = produceBounding({
        boundary,
        x: eventPosition.clientX - parentRect.left - moving.x,
        y: eventPosition.clientY - parentRect.top - moving.y,
        parentSize: parentRect,
        childSize: childRef.current.getBoundingClientRect(),
      });

      positionRef.current = nextPosition;
      panZoomRef.style.transform = produceStyle({
        position: positionRef.current,
        zoom: zoomRef.current,
      });

      const eventValue = {
        position: { ...positionRef.current },
        zoom: zoomRef.current,
      };

      if (onContainerChange) onContainerChange(eventValue);
      if (onContainerPositionChange) onContainerPositionChange(eventValue);
    };

    const mouseMoveClear = onMouseMove(move);
    return mouseMoveClear;
  }, [boundary, loading, moving]);

  return positionRef;
};

export default useMove;
