import { useEffect } from 'react'
import throttle from 'lodash/throttle'

import { transform } from '../helpers/produceStyle'
import { usePanZoom } from '../context'

const ZOOM_SPEED_BASE = 25 // ms

const useZoom = (ref) => {
  const { positionRef, zoomRef, zoomSpeed, zoomStep } = usePanZoom()

  useEffect(() => {
    const wheel = throttle((e) => {
      var xoff = (e.clientX - positionRef.current.x) / zoomRef.current
      var yoff = (e.clientY - positionRef.current.y) / zoomRef.current

      const nextZoom = (e.deltaY < 0) ? zoomRef.current + zoomStep : zoomRef.current - zoomStep
      zoomRef.current = nextZoom

      positionRef.current = {
        x: e.clientX - xoff * nextZoom,
        y: e.clientY - yoff * nextZoom,
      }

      ref.current.style.transform = transform({ position: positionRef.current, zoom: nextZoom })
    }, ZOOM_SPEED_BASE / zoomSpeed)

    let node = ref.current
    if (!node) return wheel.cancel

    node.parentNode.addEventListener('wheel', wheel)

    return () => {
      wheel.cancel()
      node.parentNode.removeEventListener('wheel', wheel)
    }
  }, [ref, zoomSpeed, zoomStep])

  return zoomRef.current
}

export default useZoom
