import { useEffect, useState } from 'react'

import { transform } from '../helpers/produceStyle'
import { usePanZoom } from '../context'

const useMove = (ref) => {
  const [moving, setMoving] = useState(null)
  const { disabled, disabledMove, positionRef, zoomRef } = usePanZoom()
  
  // Handle mousedown + mouseup
  useEffect(() => {
    if (disabled || disabledMove) return

    const mousedown = (e) => {
      const rect = ref.current.parentNode.getBoundingClientRect()
      setMoving({
        x: e.clientX - rect.x - (positionRef.current.x || 0),
        y: e.clientY - rect.y - (positionRef.current.y || 0),
      })
    }

    const mouseup = () => setMoving(null)

    let node = ref.current
    if (!node) return

    node.parentNode.addEventListener('mousedown', mousedown)
    window.addEventListener('mouseup', mouseup)

    return () => {
      node.parentNode.removeEventListener('mousedown', mousedown)
      window.removeEventListener('mouseup', mouseup)
    }
  }, [disabled, disabledMove, ref])

  // Handle mousemove
  useEffect(() => {
    let node = ref.current
    if (!node || !moving) return

    const move = (e) => {
      const rect = ref.current.parentNode.getBoundingClientRect()
      positionRef.current = {
        x: e.clientX - rect.x - moving.x,
        y: e.clientY - rect.y - moving.y,
      }
      ref.current.style.transform = transform({ position: positionRef.current, zoom: zoomRef.current })
    }

    node.parentNode.addEventListener('mousemove', move)

    return () => {
      node.parentNode.removeEventListener('mousemove', move)
    }
  }, [ref, moving])

  return positionRef.current
}

export default useMove
