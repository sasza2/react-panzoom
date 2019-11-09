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
    if (!ref.current) return
    ref.current.addEventListener('mousemove', move)
    return () => {
      ref.current.removeEventListener('mousemove', move)
    }
  }, [])

  return position

}

export default useMousePosition
