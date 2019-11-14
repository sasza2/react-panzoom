import { useEffect } from 'react'
import throttle from 'lodash/throttle'

import { usePanZoom } from '../context'

const useZoom = (ref) => {
  const { setZoom, zoom } = usePanZoom()

  useEffect(() => {
    const wheel = throttle((e) => {
      if (e.deltaY < 0) setZoom(zoom + 0.1)
      else setZoom(zoom - 0.1)
    }, 300)

    let node = ref.current
    if (!node) return wheel.cancel

    node.parentNode.addEventListener('wheel', wheel)

    return () => {
      wheel.cancel()
      node.parentNode.removeEventListener('wheel', wheel)
    }
  }, [ref, setZoom, zoom])  

  return zoom
}

export default useZoom
