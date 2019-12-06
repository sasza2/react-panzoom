import { useEffect, useState } from 'react';

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
      const rect = ref.current.parentNode.getBoundingClientRect();
      setMoving({
        x: e.clientX - rect.left - (positionRef.current.x || 0),
        y: e.clientY - rect.top - (positionRef.current.y || 0),
      });
    };

    const mouseup = () => setMoving(null);

    const node = ref.current;
    if (!node) return undefined;

    node.parentNode.addEventListener('mousedown', mousedown);
    window.addEventListener('mouseup', mouseup);

    return () => {
      node.parentNode.removeEventListener('mousedown', mousedown);
      window.removeEventListener('mouseup', mouseup);
    };
  }, [disabled, disabledMove, loading]);

  // Handle mousemove
  useEffect(() => {
    if (loading || !moving) return undefined;

    const move = (e) => {
      const rect = ref.current.parentNode.getBoundingClientRect();
      const nextPosition = produceBounding({
        boundary,
        x: e.clientX - rect.left - moving.x,
        y: e.clientY - rect.top - moving.y,
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

    return () => {
      window.removeEventListener('mousemove', move);
    };
  }, [boundary, loading, moving, onChange, onPositionChange]);

  return positionRef;
};

export default useMove;
