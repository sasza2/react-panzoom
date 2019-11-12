import { useContext } from 'react'

import PanZoomContext from './PanZoomContext'

const useUrlSync = () => {
  const { setZoom, zoom, setPosition, position } = useContext(PanZoomContext)

  return {
    setZoom,
    zoom,
    setPosition,
    position,
  }
}

export default useUrlSync