import { useEffect, useState } from 'react'

const useMousePosition = (ref) => {
  const [position, setPosition] = useState({})

  const move = (e) => {
    setPosition({
      x: e.clientX,
      y: e.clientY,
    })
  }

  useEffect(() => {
    let node = ref.current
    if (!node) return
    node.addEventListener('mousemove', move)

    return () => {
      node.removeEventListener('mousemove', move)
    }
  }, [ref])

  return position
}

export default useMousePosition
