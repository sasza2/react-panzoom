import { useEffect } from 'react';
import throttle from 'lodash/throttle';

import { usePanZoom } from 'context';
import transform from 'helpers/produceStyle';
import produceBounding from 'helpers/produceBounding';
import zoomRound from 'helpers/zoomRound';

const ZOOM_SPEED_BASE = 100; // ms

const useZoom = () => {
  const {
    boundary,
    childRef,
    disabled,
    disabledZoom,
    loading,
    positionRef,
    onContainerChange,
    onContainerZoomChange,
    zoomMax,
    zoomMin,
    zoomRef,
    zoomSpeed,
    zoomStep,
  } = usePanZoom();

  const panZoomRef = childRef.current;

  const dependencies = [
    boundary,
    childRef,
    disabled,
    disabledZoom,
    loading,
    onContainerChange,
    onContainerZoomChange,
    zoomSpeed,
    zoomStep,
  ];

  useEffect(() => {
    if (loading || disabled || disabledZoom) return undefined;

    const wheel = throttle((e) => {
      const rect = panZoomRef.parentNode.getBoundingClientRect();

      const xoff = (e.clientX - rect.left - positionRef.current.x) / zoomRef.current;
      const yoff = (e.clientY - rect.top - positionRef.current.y) / zoomRef.current;

      const nextZoom = zoomRound((() => {
        if (e.deltaY < 0) {
          if (zoomMax && zoomRef.current >= zoomMax) return zoomMax;
          return zoomRef.current + zoomStep;
        }
        if (zoomMin && zoomRef.current <= zoomMin) return zoomMin;
        return zoomRef.current - zoomStep;
      })());

      zoomRef.current = nextZoom;

      panZoomRef.style.transform = transform({ position: positionRef.current, zoom: nextZoom });

      const nextPosition = produceBounding({
        boundary,
        x: e.clientX - rect.left - xoff * nextZoom,
        y: e.clientY - rect.top - yoff * nextZoom,
        parent: rect,
        rect: panZoomRef.getBoundingClientRect(),
        co: nextZoom,
      });

      positionRef.current = nextPosition;
      panZoomRef.style.transform = transform({ position: nextPosition, zoom: nextZoom });

      if (onContainerChange) {
        onContainerChange({ position: { ...positionRef.current }, zoom: nextZoom });
      }
      if (onContainerZoomChange) {
        onContainerZoomChange({ zoom: nextZoom, position: { ...positionRef.current } });
      }
    }, ZOOM_SPEED_BASE / zoomSpeed);

    if (!panZoomRef) return wheel.cancel;

    const onWheel = (e) => {
      e.preventDefault();
      wheel(e);
    };

    panZoomRef.parentNode.addEventListener('wheel', onWheel);

    return () => {
      wheel.cancel();
      panZoomRef.parentNode.removeEventListener('wheel', onWheel);
    };
  }, dependencies);

  return zoomRef;
};

export default useZoom;
