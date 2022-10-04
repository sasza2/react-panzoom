import { useEffect } from 'react';

import { Zoom, ZoomEvent } from 'types'
import { usePanZoom } from 'context';
import isEventMobileZoom from 'helpers/isEventMobileZoom'
import transform from 'helpers/produceStyle';
import produceBounding from 'helpers/produceBounding';
import produceNextZoom from 'helpers/produceNextZoom';
import throttle from 'helpers/throttle'
import touchEventToZoomInit from 'helpers/touchEventToZoomInit'

const ANIMATION_DELAY = 300 // ms
const ANIMATION_DELAY_STR = `${ANIMATION_DELAY / 1000}s`
const DESKTOP_THROTTLE_DELAY = 100 // ms
const NON_DESKTOP_THROTTLE_DELAY = 5 // ms
const NON_DESKTOP_MOVING_BLOCK_DELAY = 300 // ms

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
      panZoomRef.style.transform = transform({ position: nextPosition, zoom: nextZoom });
      panZoomRef.style.setProperty('--zoom', nextZoom.toString());

      if (onContainerChange) {
        onContainerChange({ position: { ...positionRef.current }, zoom: nextZoom });
      }
      if (onContainerZoomChange) {
        onContainerZoomChange({ zoom: nextZoom, position: { ...positionRef.current } });
      }
    };

    const wheelDesktop = throttle(wheelFunc, DESKTOP_THROTTLE_DELAY)
    const wheelMobile = throttle(wheelFunc, NON_DESKTOP_THROTTLE_DELAY)

    const [touchEventToZoom, resetTouchEvent] = touchEventToZoomInit()

    const animationInit = () => {
      let animationTimer: ReturnType<typeof setTimeout> = null
      let blockTimer: ReturnType<typeof setTimeout> = null
      return ({ isDesktop }: { isDesktop: boolean }) => {
        clearTimeout(animationTimer)
        clearTimeout(blockTimer)

        animationTimer = setTimeout(() => {
          resetTouchEvent()
          panZoomRef.style.transition = null
        }, ANIMATION_DELAY)

        if (!isDesktop) {
          blockTimer = setTimeout(() => {
            blockMovingRef.current = false
          }, NON_DESKTOP_MOVING_BLOCK_DELAY)

          blockMovingRef.current = true
        }

        panZoomRef.style.transition = `transform ${ANIMATION_DELAY_STR}`
      }
    }

    const doAnimation = animationInit()

    const onWheel = (e: WheelEvent) => {
      doAnimation({ isDesktop: true })
      wheelDesktop(e, { isDesktop: true })
    }

    const onWheelMobile = (e: TouchEvent) => {
      if (!isEventMobileZoom(e)) return
      doAnimation({ isDesktop: false })
      wheelMobile(touchEventToZoom(e), { isDesktop: false })
    }

    panZoomRef.parentNode.addEventListener('wheel', onWheel);
    panZoomRef.parentNode.addEventListener('touchmove', onWheelMobile);

    return () => {
      wheelDesktop.cancel();
      wheelMobile.cancel();
      panZoomRef.parentNode.removeEventListener('wheel', onWheel);
      panZoomRef.parentNode.removeEventListener('touchmove', onWheelMobile);
    };
  }, dependencies);

  return zoomRef;
};

export default useZoom;
