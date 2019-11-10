import { useEffect } from 'react'

import { usePanZoom } from '../context'

const useZoom = (ref) => {
  const { zoom } = usePanZoom()

  const move = (e) => {
    console.log(e)
  }

  useEffect(() => {
    let node = ref.current
    if (!node) return
    node.addEventListener('mousemove', move)

    return () => {
      node.removeEventListener('mousemove', move)
    }
  }, [ref])

  return zoom
}

export default useZoom
