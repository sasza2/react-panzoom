import { useEffect, useRef, useState } from 'react'

import { transform } from '../helpers/produceStyle'
import { usePanZoom } from '../context'

const useMove = (ref) => {
  const nextPosition = useRef()
  const [moving, setMoving] = useState(null)
  const { position, setPosition, zoom } = usePanZoom()
  
  // Handle mousedown + mouseup
  useEffect(() => {
    const mousedown = (e) => {
      const rect = ref.current.parentNode.getBoundingClientRect()
      setMoving({
        x: e.clientX - rect.x - (position.x || 0),
        y: e.clientY - rect.y - (position.y || 0),
      })
    }

    const mouseup = () => {
      setMoving(null)
      setPosition({
        x: nextPosition.current.x,
        y: nextPosition.current.y,
      })
    }

    let node = ref.current
    if (!node) return

    console.log('...')

    node.parentNode.addEventListener('mousedown', mousedown)
    window.addEventListener('mouseup', mouseup)

    return () => {
      node.parentNode.removeEventListener('mousedown', mousedown)
      window.removeEventListener('mouseup', mouseup)
    }
  }, [position, ref, zoom])

  // Handle mousemove
  useEffect(() => {
    let node = ref.current
    if (!node || !moving) return

    const move = (e) => {
      const rect = ref.current.parentNode.getBoundingClientRect()
      nextPosition.current = {
        x: e.clientX - rect.x - moving.x,
        y: e.clientY - rect.y - moving.y,
      }
      ref.current.style.transform = transform({ position: nextPosition.current, zoom })
    }

    node.parentNode.addEventListener('mousemove', move)

    return () => {
      node.parentNode.removeEventListener('mousemove', move)
    }
  }, [ref, moving, zoom])

  return position
}

export default useMove
