import { useEffect, useState } from 'react'

import { usePanZoom } from '../context'

const useMove = (ref) => {
  const [moving, setMoving] = useState(null)
  const { position, setPosition } = usePanZoom()
  
  useEffect(() => {
    const mousedown = (e) => {
      const rect = ref.current.parentNode.getBoundingClientRect()
      setMoving({
        x: e.clientX - rect.x - (position.x || 0),
        y: e.clientY - rect.y - (position.y || 0),
      })
    }

    const mouseup = () => setMoving(null)

    let node = ref.current
    if (!node) return

    node.addEventListener('mousedown', mousedown)
    node.addEventListener('mouseup', mouseup)

    return () => {
      node.removeEventListener('mousemove', mousedown)
      node.removeEventListener('mousemove', mouseup)
    }
  }, [position, ref])

  useEffect(() => {
    let node = ref.current
    if (!node || !moving) return

    const move = (e) => {
      const rect = ref.current.getBoundingClientRect()
      setPosition({
        x: e.clientX - rect.x - moving.x,
        y: e.clientY - rect.y - moving.y,
      })
    }

    node.addEventListener('mousemove', move)

    return () => {
      node.removeEventListener('mousemove', move)
    }
  }, [ref, moving])

  return position
}

export default useMove
