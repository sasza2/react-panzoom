import { useEffect, useState } from 'react';

import positionFromEvent from '../helpers/positionFromEvent';
import transform from '../helpers/produceStyle';
import produceBounding from '../helpers/produceBounding';
import { usePanZoom } from '../context';

const useMove = (ref, loading) => {
  const panZoomRef = ref.current;
  const [moving, setMoving] = useState(null);
  const {
    boundary,
    disabled,
    disabledMove,
    onChange,
    onPositionChange,
    positionRef,
    zoomRef,
  } = usePanZoom();

  // Handle mousedown + mouseup
  useEffect(() => {
    if (loading || disabled || disabledMove) return undefined;

    const mousedown = (e) => {
      const eventPosition = positionFromEvent(e);
      const rect = ref.current.parentNode.getBoundingClientRect();
      setMoving({
        x: eventPosition.clientX - rect.left - (positionRef.current.x || 0),
        y: eventPosition.clientY - rect.top - (positionRef.current.y || 0),
      });
    };

    const mouseup = () => setMoving(null);

    const node = ref.current;
    if (!node) return undefined;

    node.parentNode.addEventListener('mousedown', mousedown);
    node.parentNode.addEventListener('touchstart', mousedown);
    window.addEventListener('mouseup', mouseup);
    window.addEventListener('touchend', mouseup);

    return () => {
      node.parentNode.removeEventListener('mousedown', mousedown);
      node.parentNode.removeEventListener('touchstart', mousedown);
      window.removeEventListener('mouseup', mouseup);
      window.removeEventListener('touchend', mouseup);
    };
  }, [disabled, disabledMove, loading]);

  // Handle mousemove
  useEffect(() => {
    if (loading || !moving) return undefined;

    const move = (e) => {
      const rect = ref.current.parentNode.getBoundingClientRect();
      const eventPosition = positionFromEvent(e);
      const nextPosition = produceBounding({
        boundary,
        x: eventPosition.clientX - rect.left - moving.x,
        y: eventPosition.clientY - rect.top - moving.y,
        parent: rect,
        rect: ref.current.getBoundingClientRect(),
      });

      positionRef.current = nextPosition;
      panZoomRef.style.transform = transform({
        position: positionRef.current,
        zoom: zoomRef.current,
      });
      if (onChange) onChange({ position: { ...positionRef.current }, zoom: zoomRef.current });
      if (onPositionChange) onPositionChange({ position: { ...positionRef.current } });
    };

    window.addEventListener('mousemove', move);
    window.addEventListener('touchmove', move);

    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('touchmove', move);
    };
  }, [boundary, loading, moving, onChange, onPositionChange]);

  return positionRef;
};

export default useMove;
