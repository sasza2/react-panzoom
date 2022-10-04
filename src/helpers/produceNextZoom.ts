import { Zoom, ZoomEvent } from 'types'
import zoomRound from './zoomRound'

const DESKTOP_DEFAULT_STEP = 0.25 // transform scale
const NON_DESKTOP_DEFAULT_STEP = 0.05 // transform scale

type ProduceNextZoom = (props: {
  isDesktop: boolean,
  e: ZoomEvent,
  zoomRef: Zoom,
  zoomSpeed: number,
  zoomMin?: number,
  zoomMax?: number,
}) => number

const produceNextZoom: ProduceNextZoom = ({
  e,
  isDesktop,
  zoomRef,
  zoomSpeed,
  zoomMin,
  zoomMax,
}) => {
  const step = 1 + zoomSpeed * (isDesktop ? DESKTOP_DEFAULT_STEP : NON_DESKTOP_DEFAULT_STEP)

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
