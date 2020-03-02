import { useEffect, useState } from 'react';

import { onMouseDown, onMouseUp, onMouseMove } from '../helpers/eventListener';
import positionFromEvent from '../helpers/positionFromEvent';
import transform from '../helpers/produceStyle';
import produceBounding from '../helpers/produceBounding';
import { usePanZoom } from '../context';

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

  // Handle mousedown + mouseup
  useEffect(() => {
    if (loading) return undefined;

    const mousedown = (e) => {
      const eventPosition = positionFromEvent(e);
      const rect = childRef.current.parentNode.getBoundingClientRect();

      const position = {
        x: eventPosition.clientX - rect.left - (positionRef.current.x || 0),
        y: eventPosition.clientY - rect.top - (positionRef.current.y || 0),
      };

      if (onContainerClick) {
        onContainerClick({
          x: position.x / zoomRef.current,
          y: position.y / zoomRef.current,
        });
      }
      if (disabled || disabledMove) return;

      setMoving(position);
    };

    const mouseup = () => setMoving(null);

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
