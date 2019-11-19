import { useEffect } from 'react'
import throttle from 'lodash/throttle'

import { transform } from '../helpers/produceStyle'
import { usePanZoom } from '../context'

const ZOOM_SPEED_BASE = 25 // ms

const useZoom = (ref) => {
  const { 
    disabled,
    disabledZoom,
    positionRef,
    onZoomChange,
    zoomMax,
    zoomMin,
    zoomRef,
    zoomSpeed,
    zoomStep
  } = usePanZoom()

  useEffect(() => {
    if (disabled || disabledZoom) return

    const wheel = throttle((e) => {
      var xoff = (e.clientX - positionRef.current.x) / zoomRef.current
      var yoff = (e.clientY - positionRef.current.y) / zoomRef.current

      const nextZoom = (() => {
        if(e.deltaY < 0){
          if (zoomMax && zoomRef.current >= zoomMax) return zoomMax
          return zoomRef.current + zoomStep
        } else {
          if (zoomMin && zoomRef.current <= zoomMin) return zoomMin
          return zoomRef.current - zoomStep
        }
      })()
      zoomRef.current = nextZoom

      positionRef.current = {
        x: e.clientX - xoff * nextZoom,
        y: e.clientY - yoff * nextZoom,
      }

      ref.current.style.transform = transform({ position: positionRef.current, zoom: nextZoom })
      if (onZoomChange) onZoomChange({ zoom: nextZoom, position: { ...positionRef.current } })
    }, ZOOM_SPEED_BASE / zoomSpeed)

    let node = ref.current
    if (!node) return wheel.cancel

    node.parentNode.addEventListener('wheel', wheel)

    return () => {
      wheel.cancel()
      node.parentNode.removeEventListener('wheel', wheel)
    }
  }, [disabled, disabledZoom, onZoomChange, ref, zoomSpeed, zoomStep])

  return zoomRef.current
}

export default useZoom
