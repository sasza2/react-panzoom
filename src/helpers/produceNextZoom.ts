import { ZOOM_DESKTOP_DEFAULT_STEP, ZOOM_NON_DESKTOP_DEFAULT_STEP } from 'consts'
import { Zoom, ZoomEvent } from 'types'
import zoomRound from './zoomRound'

type ProduceNextZoom = (props: {
  isMobile: boolean,
  e: ZoomEvent,
  zoomRef: Zoom,
  zoomSpeed: number,
  zoomMin?: number,
  zoomMax?: number,
}) => number

const produceNextZoom: ProduceNextZoom = ({
  e,
  isMobile,
  zoomRef,
  zoomSpeed,
  zoomMin,
  zoomMax,
}) => {
  const step = 1 + zoomSpeed * (isMobile ? ZOOM_NON_DESKTOP_DEFAULT_STEP : ZOOM_DESKTOP_DEFAULT_STEP)

  const nextZoom = zoomRound((() => {
    if (!e.deltaY) return zoomRef.current
    if (e.deltaY < 0) {
      const nextZoom = zoomRef.current * step
      if (zoomMax && nextZoom >= zoomMax) return zoomMax;
      return nextZoom;
    }
    const nextZoom = zoomRef.current / step
    if (zoomMin && nextZoom <= zoomMin) return zoomMin;
    return nextZoom;
  })());

  return nextZoom
}

export default produceNextZoom
