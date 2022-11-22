import { useEffect } from 'react';

import {
  ZOOM_ANIMATION_DELAY,
  ZOOM_ANIMATION_DELAY_STR,
  ZOOM_DESKTOP_THROTTLE_DELAY,
  ZOOM_NON_DESKTOP_THROTTLE_DELAY,
  ZOOM_NON_DESKTOP_MOVING_BLOCK_DELAY,
} from 'consts'
import { Zoom, ZoomEvent } from 'types'
import { usePanZoom } from 'context';
import isEventMobileZoom from 'helpers/isEventMobileZoom'
import produceStyle from 'helpers/produceStyle';
import produceBounding from 'helpers/produceBounding';
import produceNextZoom from 'helpers/produceNextZoom';
import throttle from 'helpers/throttle'
import touchEventToZoomInit from 'helpers/touchEventToZoomInit'

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
    zoomSpeed,
  ];

  useEffect(() => {
    if (loading || disabled || disabledZoom) return undefined;

    const isMobile = ('ontouchstart' in window)

    const wheelFunc = (e: ZoomEvent, { isDesktop }: { isDesktop: boolean }) => {
      const rect = (panZoomRef.parentNode as HTMLDivElement).getBoundingClientRect();

      const xoff = (e.clientX - rect.left - positionRef.current.x) / zoomRef.current;
      const yoff = (e.clientY - rect.top - positionRef.current.y) / zoomRef.current;

      const nextZoom = produceNextZoom({
        e,
        isDesktop,
        zoomRef,
        zoomSpeed,
        zoomMin,
        zoomMax,
      })

      zoomRef.current = nextZoom;

      const nextPosition = produceBounding({
        boundary,
        x: e.clientX - rect.left - xoff * nextZoom,
        y: e.clientY - rect.top - yoff * nextZoom,
        parent: rect,
        rect: panZoomRef.getBoundingClientRect(),
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

    const wheelDesktop = throttle(wheelFunc, ZOOM_DESKTOP_THROTTLE_DELAY)
    const wheelMobile = throttle(wheelFunc, ZOOM_NON_DESKTOP_THROTTLE_DELAY)

    const [touchEventToZoom, resetTouchEvent] = touchEventToZoomInit()

    const animationInit = () => {
      let animationTimer: ReturnType<typeof setTimeout> = null
      let blockTimer: ReturnType<typeof setTimeout> = null
      return ({ isDesktop }: { isDesktop: boolean }) => {
        clearTimeout(animationTimer)
        clearTimeout(blockTimer)

        animationTimer = setTimeout(() => {
          resetTouchEvent()
          if (!isMobile) panZoomRef.style.transition = null
        }, ZOOM_ANIMATION_DELAY)

        if (!isDesktop) {
          blockTimer = setTimeout(() => {
            blockMovingRef.current = false
          }, ZOOM_NON_DESKTOP_MOVING_BLOCK_DELAY)

          blockMovingRef.current = true
        }

        if (!isMobile) panZoomRef.style.transition = `transform ${ZOOM_ANIMATION_DELAY_STR}`
      }
    }

    const doAnimation = animationInit()

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      doAnimation({ isDesktop: true })
      wheelDesktop(e, { isDesktop: true })
    }

    const onWheelMobile = (e: TouchEvent) => {
      if (!isEventMobileZoom(e)) return
      doAnimation({ isDesktop: false })
      wheelMobile(touchEventToZoom(e), { isDesktop: false })
    }

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
