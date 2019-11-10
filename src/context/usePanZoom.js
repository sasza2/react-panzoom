import { useContext } from 'react'

import PanZoomContext from './PanZoomContext'

const useUrlSync = () => {
  const { setZoom, zoom } = useContext(PanZoomContext)

  return {
    setZoom,
    zoom,
  }
}

export default useUrlSync