import { useEffect } from 'react';

import {
  ZOOM_DESKTOP_THROTTLE_DURATION,
  ZOOM_NON_DESKTOP_THROTTLE_DURATION,
  ZOOM_NON_DESKTOP_MOVING_BLOCK_DELAY,
} from 'consts';
import { Zoom, ZoomEvent } from 'types';
import { usePanZoom } from 'context';
import isEventMobileZoom from 'helpers/isEventMobileZoom';
import produceStyle from 'helpers/produceStyle';
import produceBounding from 'helpers/produceBounding';
import produceNextZoom from 'helpers/produceNextZoom';
import touchEventToZoomInit from 'helpers/touchEventToZoomInit';
import throttle from 'helpers/throttle';

const useZoom = (): Zoom => {
  const {
    blockMovingRef,
    boundary,
    childRef,
    disabled,
    disabledZoom,
    loading,
    positionRef,
    onContainerChange,
    onContainerZoomChange,
    zoomInitial,
    zoomMax,
    zoomMin,
    zoomRef,
    zoomSpeed,
  } = usePanZoom();

  const panZoomRef = childRef.current;

  const dependencies = [
    JSON.stringify(boundary),
    childRef,
    disabled,
    disabledZoom,
    loading,
    zoomInitial,
    zoomSpeed,
    zoomMax,
    zoomMin,
  ];

  useEffect(() => {
    if (loading || disabled || disabledZoom) return undefined;

    const isMobile = ('ontouchstart' in window);

    const [touchEventToZoom, resetTouchEvent] = touchEventToZoomInit();
    let blockTimer: ReturnType<typeof setTimeout> = null;

    const wheelFunc = (e: ZoomEvent) => {
      const parentRect = (panZoomRef.parentNode as HTMLDivElement).getBoundingClientRect();
      const childRect = panZoomRef.getBoundingClientRect();

      if (isMobile) {
        clearTimeout(blockTimer);
        blockTimer = setTimeout(() => {
          blockMovingRef.current = false;
        }, ZOOM_NON_DESKTOP_MOVING_BLOCK_DELAY);

        blockMovingRef.current = true;
      }

      const xOffset = (e.clientX - parentRect.left - positionRef.current.x) / zoomRef.current;
      const yOffset = (e.clientY - parentRect.top - positionRef.current.y) / zoomRef.current;

      const nextZoom = produceNextZoom({
        e,
        isMobile,
        zoomRef,
        zoomSpeed,
        zoomMin,
        zoomMax,
      });

      const prevZoom = zoomRef.current;
      zoomRef.current = nextZoom;

      const nextPosition = produceBounding({
        boundary,
        x: e.clientX - parentRect.left - xOffset * nextZoom,
        y: e.clientY - parentRect.top - yOffset * nextZoom,
        parentSize: parentRect,
        childSize: {
          width: childRect.width * (nextZoom / prevZoom),
          height: childRect.height * (nextZoom / prevZoom),
        },
      });

      positionRef.current = nextPosition;
      panZoomRef.style.transform = produceStyle({ position: nextPosition, zoom: nextZoom });
      panZoomRef.style.setProperty('--zoom', nextZoom.toString());

      if (onContainerChange) {
        onContainerChange({ position: { ...positionRef.current }, zoom: nextZoom });
      }
      if (onContainerZoomChange) {
        onContainerZoomChange({ zoom: nextZoom, position: { ...positionRef.current } });
      }
    };

    const wheelDesktop = throttle(wheelFunc, ZOOM_DESKTOP_THROTTLE_DURATION);
    const wheelMobile = throttle(wheelFunc, ZOOM_NON_DESKTOP_THROTTLE_DURATION);

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      wheelDesktop(e);
    };

    const onWheelMobile = (e: TouchEvent) => {
      if (!isEventMobileZoom(e)) return;
      wheelMobile(touchEventToZoom(e));
    };

    if (isMobile) {
      panZoomRef.parentNode.addEventListener('touchmove', onWheelMobile);
      panZoomRef.parentNode.addEventListener('touchup', resetTouchEvent);
      panZoomRef.parentNode.addEventListener('touchend', resetTouchEvent);
      panZoomRef.parentNode.addEventListener('touchcancel', resetTouchEvent);
    } else {
      panZoomRef.parentNode.addEventListener('wheel', onWheel);
    }

    return () => {
      if (isMobile) {
        panZoomRef.parentNode.removeEventListener('touchmove', onWheelMobile);
        panZoomRef.parentNode.removeEventListener('touchup', resetTouchEvent);
        panZoomRef.parentNode.removeEventListener('touchend', resetTouchEvent);
        panZoomRef.parentNode.removeEventListener('touchcancel', resetTouchEvent);
        wheelMobile.cancel();
      } else {
        panZoomRef.parentNode.removeEventListener('wheel', onWheel);
        wheelDesktop.cancel();
      }
    };
  }, dependencies);

  return zoomRef;
};

export default useZoom;
