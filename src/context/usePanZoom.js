import { useContext } from 'react'

import PanZoomContext from './PanZoomContext'

const useUrlSync = () => {
  const { setOrigin, origin, setZoom, zoom, setPosition, position } = useContext(PanZoomContext)

  return {
    setOrigin,
    origin,
    setZoom,
    zoom,
    setPosition,
    position,
  }
}

export default useUrlSync