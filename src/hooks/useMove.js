import { useEffect, useState } from 'react';

import { usePanZoom } from 'context';
import { GRABBING_CLASS_NAME } from 'styles'
import { onMouseDown, onMouseUp, onMouseMove } from 'helpers/eventListener';
import positionFromEvent from 'helpers/positionFromEvent';
import produceBounding from 'helpers/produceBounding';
import transform from 'helpers/produceStyle';
import stopEventPropagation from 'helpers/stopEventPropagation';
import useContainerMouseDownPosition from './useContainerMouseDownPosition';

const useMove = () => {
  const [moving, setMoving] = useState(null);
  const {
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

    const mousedown = (e) => {
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
      if (disabled || disabledMove || stop.prevent) return;

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

    const mouseDownClear = onMouseDown(node.parentNode, mousedown);
    const mouseUpClear = onMouseUp(mouseup);

    return () => {
      mouseDownClear();
      mouseUpClear();
    };
  }, [disabled, disabledMove, loading, onContainerClick]);

  // Handle mousemove
  useEffect(() => {
    if (loading || !moving) return undefined;

    const move = (e) => {
      const rect = childRef.current.parentNode.getBoundingClientRect();
      const eventPosition = positionFromEvent(e);
      const nextPosition = produceBounding({
        boundary,
        x: eventPosition.clientX - rect.left - moving.x,
        y: eventPosition.clientY - rect.top - moving.y,
        parent: rect,
        rect: childRef.current.getBoundingClientRect(),
      });

      positionRef.current = nextPosition;
      panZoomRef.style.transform = transform({
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
  }, [boundary, loading, moving, onContainerChange, onContainerPositionChange]);

  return positionRef;
};

export default useMove;
