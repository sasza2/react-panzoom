import { useEffect } from 'react'
import throttle from 'lodash/throttle'

import { usePanZoom } from '../context'

const useZoom = (ref) => {
  const { position, setPosition, setZoom, zoom } = usePanZoom()

  useEffect(() => {
    const wheel = throttle((e) => {
      var xoff = (e.clientX - (position.x || 0)) / zoom
      var yoff = (e.clientY - (position.y || 0)) / zoom

      const nextZoom = (e.deltaY < 0) ? zoom + 0.05 : zoom - 0.05

      setZoom(nextZoom)

      setPosition({
        x: e.clientX - xoff * nextZoom,
        y: e.clientY - yoff * nextZoom,
      })
    }, 100)

    let node = ref.current
    if (!node) return wheel.cancel

    node.parentNode.addEventListener('wheel', wheel)

    return () => {
      wheel.cancel()
      node.parentNode.removeEventListener('wheel', wheel)
    }
  }, [position, ref, setPosition, setZoom, zoom])  

  return zoom
}

export default useZoom
