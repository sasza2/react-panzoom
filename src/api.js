import positionClone from './helpers/positionClone'
import { transform } from './helpers/produceStyle'

const move = ({ positionRef, ref, zoomRef }) => (x, y) => {
  if (positionRef.current) {
    positionRef.current = {
      x: positionRef.current.x + x,
      y: positionRef.current.y + y,
    }    
  } else {
    positionRef.current = { x, y }
  }

  ref.current.style.transform = transform({ position: positionRef.current, zoom: zoomRef.current })

  return positionClone(positionRef.current)
}

const api = ({ forwardRef, positionRef, ref, zoomRef }) => {
  if (!forwardRef) return

  forwardRef.current = {
    move: move({ positionRef, ref, zoomRef }),

  }  
}

export default api
